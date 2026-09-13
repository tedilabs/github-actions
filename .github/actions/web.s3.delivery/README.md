# Web - Delivery to S3

Upload web build artifacts to AWS S3 with **pattern-based `Cache-Control` and `Content-Type` rules**.

Rules follow CloudFront behavior semantics: an ordered list of pattern rules is evaluated
top-to-bottom, the **first matching rule wins**, and files matching no rule fall back to
`default_upload_rule` — just like custom behaviors falling back to the default behavior.

## Why rule-based cache control?

Build artifacts mix two kinds of files with opposite caching needs:

| Kind | Example | Correct policy |
| --- | --- | --- |
| **Immutable assets** — content hash in the filename; a change produces a new URL | `assets/index.abc123.js` | Cache as long as possible: `max-age=31536000, immutable` |
| **Mutable entries** — fixed URL, changing content | `index.html`, `widget.js`, `manifest.json`, `sw.js` | Short browser cache so deploys propagate: browser cache **cannot** be invalidated once served |

Applying a single blanket `Cache-Control` to everything gets one of the two wrong.
In particular, a long `max-age` on a fixed-URL entry file means end users may run a stale
version for up to a year, with **no server-side remedy** (CloudFront invalidation does not
reach browser caches).

The **default rule** (`default_upload_rule`) is intentionally fail-safe: any file not
matched by a rule gets `public, max-age=300, s-maxage=86400, must-revalidate` — browsers
revalidate within 5 minutes (deploys propagate quickly), while CloudFront still caches at
the edge for a day via `s-maxage` (origin cost stays low, and the edge cache remains
controllable via invalidation).

> **Why can't `default_upload_rule` set a `content_type`?** A rule's `content_type`
> override is safe because the rule targets a narrow pattern. The default rule applies to
> *everything else* — an arbitrary mix of file types — so no single Content-Type can be
> correct there. Content-Type for default-rule files is always auto-detected per file
> (setting one explicitly is rejected with an error). To override Content-Type, add an
> `upload_rules` entry with a pattern.

## Usage

```yaml
- name: Deliver to S3
  uses: tedilabs/github-actions/.github/actions/web.s3.delivery@main
  with:
    aws_github_oidc_iam_role: arn:aws:iam::123456789012:role/github-actions
    aws_region: ap-northeast-2
    source: ./dist
    aws_s3_bucket_name: my-web-bucket
    upload_rules: |
      [
        { "pattern": "assets/**", "cache_control": "public, max-age=31536000, immutable" },
        { "pattern": "*.html", "cache_control": "no-cache" },
        { "pattern": "sw.js", "cache_control": "no-cache" }
      ]
    delete_exclude_patterns: |
      assets/**
```

`upload_rules` and `default_upload_rule` accept **YAML or JSON** (JSON is a subset of
YAML). The same rules in YAML block style:

```yaml
    upload_rules: |
      - pattern: "assets/**"
        cache_control: "public, max-age=31536000, immutable"
      - pattern: "*.html"
        cache_control: "no-cache"
      - pattern: "sw.js"
        cache_control: "no-cache"
```

> Quote glob patterns (`"*.html"`, `"sw.js"`): an unquoted leading `*` is a YAML alias
> indicator and fails to parse. Quoting `cache_control` values is also safest since they
> contain commas.

### Rule object

```jsonc
{
  "pattern": "assets/**",                                  // required, gitignore-style glob
  "cache_control": "public, max-age=31536000, immutable",  // required
  "content_type": "text/javascript; charset=utf-8"         // optional override
}
```

- `pattern` — gitignore-style glob (same syntax as the `source_ignore` input, evaluated with
  [pathspec](https://pypi.org/project/pathspec/) `gitignore` patterns).
- `cache_control` — the `Cache-Control` header stored on matched objects.
- `content_type` — optional. When omitted, the type is detected from the file extension and
  `; charset=utf-8` is appended automatically for text-like types (`text/*`,
  `application/json`, `image/svg+xml`, ...). JavaScript is served as `text/javascript`
  (the MIME type recommended by the current HTML standard).

### Pattern syntax cheat sheet

| Pattern | Matches | Does NOT match |
| --- | --- | --- |
| `assets/**` | `assets/a.js`, `assets/img/b.png` | `src/assets/a.js` |
| `*.html` | `index.html`, `docs/about.html` (any depth) | `page.htm` |
| `/widget.js` | `widget.js` at the root only | `vendor/widget.js` |
| `widget.js` | `widget.js` at any depth | `widget.min.js` |
| `*.{js}`-style brace expansion | *(not supported — use one rule per pattern)* | |

> A pattern **without** a `/` matches at any depth; a pattern **with** a leading `/` is
> anchored to the source root — standard `.gitignore` semantics.

### Example rule sets

**SPA with hashed assets (Vite/webpack default layout):**

| Order | Pattern | Cache-Control | Rationale |
| --- | --- | --- | --- |
| 0 | `assets/**` | `public, max-age=31536000, immutable` | Content-hashed; URL changes with content, so cache forever. `immutable` skips revalidation even on reload. |
| 1 | `*.html` | `no-cache` | Always revalidate; the HTML is the deploy entry point. |
| 2 | `sw.js` | `no-cache` | A long-cached service worker can pin an entire site to an old version. |
| — | *(default)* | `public, max-age=300, s-maxage=86400, must-revalidate` | Anything else (favicons, manifest, robots.txt): fast propagation, cheap edge. |

**Third-party embed script (fixed public URL, e.g. `widget.js` on customer pages):**

| Order | Pattern | Cache-Control | Rationale |
| --- | --- | --- | --- |
| 0 | `/widget.js` | `public, max-age=300, s-maxage=86400, must-revalidate` | Fixed URL embedded on customer sites — browser cache must stay short; edge cache handles origin load and stays invalidatable. |
| 1 | `chunks/**` | `public, max-age=31536000, immutable` | Hash-named lazy chunks loaded by the entry script. |

## Upload sequence

Uploads always happen in three phases so that visitors mid-deploy never receive an HTML
referencing not-yet-uploaded assets (this was a toggle in v1; with batch uploads the
ordering is free, so it is now always on):

1. non-HTML files
2. HTML files except `index.html`
3. `index.html`

## Deletion behavior

With `delete_stale_objects: "true"` (default), objects present in the destination but absent from
the source are deleted **after** all uploads, via explicit `s3api delete-objects` calls.

> **Why not `aws s3 sync --delete`?** A trailing `--delete` sync can silently *re-upload*
> files without `--cache-control` / `--content-type` / `--metadata`, stripping their
> headers. Explicit deletion can never touch headers.

Use `delete_exclude_patterns` to retain previous content-hashed assets for a while.
(This cannot be folded into `upload_rules`: upload rules classify **local files**, while
delete exclusions match **remote keys** that no longer exist locally.)
Browsers and edge caches may still hold the previous HTML for a short window after a
deploy; if the old hashed chunks are deleted immediately, those visitors hit
`ChunkLoadError`. Excluding `assets/**` from deletion (and cleaning up via an S3 lifecycle
rule instead) avoids this.

```yaml
delete_exclude_patterns: |
  assets/**
```

## Run summary

Each run appends a classification table to the GitHub Actions step summary — which rule
matched how many files, plus the default fallback count — so a misclassified entry file
(e.g. an embed script accidentally caught by an `immutable` rule) is visible at review time.
Rules that match zero files emit a workflow warning (typo guard).

## Migration from v1

Breaking changes compared to the previous version of this action:

1. **Cache-Control is now always set.** Previously, the non-safe-sequence path uploaded
   with *no* `Cache-Control`, leaving caching to CloudFront defaults and browser
   heuristics. Now every object gets either a rule's value or `default_upload_rule`.
2. **Non-HTML files no longer default to 1-year cache.** The safe-sequence path used to
   apply `max-age=31536000` to *all* non-HTML files, which is unsafe for fixed-URL entry
   files. Long cache now requires an explicit opt-in rule (add `assets/**` →
   `max-age=31536000, immutable` to restore it for hashed assets).
3. **`Content-Type` is set explicitly** with `charset=utf-8` for text types, instead of
   relying on AWS CLI extension guessing.
4. **`delete_on_sync` is renamed to `delete_stale_objects`** (deletion no longer uses
   `sync`), and disabling it now actually works — the previous expression
   `${{ inputs.delete_on_sync && '--delete' || '' }}` treated the string `"false"` as
   truthy, so `--delete` was always applied.
5. **`safe_upload_sequence_enabled` is removed.** Phased ordering is free with batch
   uploads, so it is always on.
6. Deletion is explicit (`s3api delete-objects`) and supports `delete_exclude_patterns`.
7. **Rule inputs are named `default_upload_rule` (JSON object) / `upload_rules`
   (JSON array)** so the names stay stable as rules gain more properties over time.

Recommended rollout: release as a `v2` tag (or a dedicated branch) and migrate callers
one by one, since all current callers reference `@main`.
