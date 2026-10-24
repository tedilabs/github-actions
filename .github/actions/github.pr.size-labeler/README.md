# GitHub - PR Size Labeler

Label pull requests as XS, S, M, L, or XL using additions and deletions reported by GitHub. This alternative composite action runs `size_labeler.py` with `uv run --locked --script`. It sets up uv 0.13.2 and Python 3.12 and installs the dependencies declared in PEP 723 inline metadata into uv’s script environment. It runs on AMD64 and ARM64 without Docker, checkout, npm, a pyproject.toml, or a build step. The caller’s Python environment is not modified. The initial run requires network access to download tools and packages; uv reuses its local cache. Use a current Actions Runner compatible with the setup-uv action.

## Usage

```yaml
name: PR Size

on:
  pull_request_target:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: pr-size-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  label:
    runs-on: [self-hosted, linux, ARM64]
    steps:
    - uses: tedilabs/github-actions/.github/actions/github.pr.size-labeler@main
      with:
        ignore_file_deletions: "true"
        ignore_line_deletions: "false"
        overwrite_other_size_labels: "false"
```

The same action works on `ubuntu-24.04`, `ubuntu-24.04-arm`, and compatible AMD64 self-hosted runners. No PR code is checked out or executed. Configuration is read from the base repository at the PR's base SHA, including for fork PRs. Configuration changes in a PR therefore take effect after merging; they cannot change that PR's labeling policy. Use `pr_number` for events without a PR payload.

The existing `github.pr.auto-label.yaml` reusable workflow delegates to this action. Its existing `pr_size_*_label` and `pr_size_*_max` inputs keep their behavior. New settings are available as `pr_size_config_file`, `pr_size_files_to_ignore`, `pr_size_ignore_file_deletions`, `pr_size_ignore_line_deletions`, `pr_size_overwrite_other_size_labels`, `pr_size_label_prefix`, `pr_size_fail_if_xl`, `pr_size_message_if_xl`, and `pr_size_dry_run`.

## Configuration precedence

1. Built-in defaults.
2. Action inputs.
3. Values explicitly present in the configuration file.

With an empty `config_file`, the action tries `.github/size-labeler.yaml` and then `.github/size-labeler.yml`. The first existing file wins; files are not merged. If neither exists, inputs are used.

Set `config_file: .github/custom-size.yaml` to read only that path. An explicitly selected missing file fails, while a missing auto-discovery file is optional. Invalid configuration and permission errors always fail before changes are made.

Files use the same flat setting names as action inputs. Only policy settings in the table below can be overridden. `GITHUB_TOKEN`, `github_api_url`, `pr_number`, and `config_file` remain invocation inputs. Unknown keys, duplicate YAML keys, multiple documents, invalid booleans, and non-increasing thresholds fail validation. An empty file or `{}` applies no overrides.

For example, `.github/size-labeler.yaml`:

```yaml
xs_label: size/XS
xs_max_size: 15
s_label: size/S
s_max_size: 100
m_label: size/M
m_max_size: 500
l_label: size/L
l_max_size: 1000
xl_label: size/XL

files_to_ignore:
- "**/*.lock"
- "**/package-lock.json"
- "generated/**"

ignore_file_deletions: true
ignore_line_deletions: false
overwrite_other_size_labels: false
size_label_prefix: size/
fail_if_xl: false
message_if_xl: Please consider splitting this PR into smaller changes.
dry_run: false
```

## Policy inputs

| Input | Default | Behavior |
| --- | --- | --- |
| `xs_label`, `s_label`, `m_label`, `l_label`, `xl_label` | `size/XS`, `size/S`, `size/M`, `size/L`, `size/XL` | Five distinct managed label names. |
| `xs_max_size`, `s_max_size`, `m_max_size`, `l_max_size` | `15`, `100`, `500`, `1000` | Strictly increasing **exclusive** upper bounds. |
| `files_to_ignore` | Empty | Whitespace-separated globs in inputs; a string or list in YAML. |
| `ignore_file_deletions` | `true` | Exclude entirely removed files from line and file counts. |
| `ignore_line_deletions` | `false` | Count additions only, excluding deleted lines in all files. |
| `overwrite_other_size_labels` | `false` | Also remove other size labels matching `size_label_prefix`. |
| `size_label_prefix` | `size/` | Case-insensitive prefix used only when overwriting other size labels. |
| `fail_if_xl` | `false` | Fail the step after labeling/commenting on an XL PR. |
| `message_if_xl` | Existing tedilabs warning text | Sticky XL comment. Set `""` to disable. |
| `dry_run` | `false` | Compute planned label changes without writes or XL failure enforcement. |

The defaults preserve the tedilabs workflow: XS is 0–14 lines, S is 15–99, M is 100–499, L is 500–999, and XL is 1000 or more. This action accepts the CodelyTV input names, including `GITHUB_TOKEN` and `github_api_url`, but defaults to tedilabs' uppercase labels, XS threshold of 15, and exclusion of deleted files. It does not copy CodelyTV's lowercase standalone defaults.

Glob rules use the same Bash-style semantics as the JavaScript alternative, including negated character classes and extglobs; neither implementation relies on picomatch-specific matching quirks. Patterns match the current repository-relative filename, including dotfiles. Use `**/*.lock` for lockfiles at any depth. Quote whitespace-containing patterns in string inputs, or use a YAML list. Rename matching uses the new path. Patterns use wcmatch glob syntax aligned with the JavaScript version’s minimatch options; they are not regular expressions. An excluded file contributes neither lines nor a file count. Binary-only changes with zero additions/deletions contribute zero lines. File counts are informational and do not affect the size grade.

Deletion examples for a PR modifying a file with 10 additions and 20 deletions, and deleting another 100-line file:

| `ignore_file_deletions` | `ignore_line_deletions` | Counted lines | Counted files |
| --- | --- | ---: | ---: |
| `true` | `false` | 30 | 1 |
| `false` | `false` | 130 | 2 |
| `true` | `true` | 10 | 1 |
| `false` | `true` | 10 | 2 |

## Label ownership and comments

GitHub labels do not record which action manages them. This action defines ownership **by configured name**: the five configured labels are managed regardless of who originally applied them. It removes obsolete managed labels and adds the selected one, preserving every unrelated label.

With the defaults, a PR containing `size/L`, `size/manual`, and `bug`, recalculated as S, becomes:

- `overwrite_other_size_labels: false`: `size/S`, `size/manual`, `bug`.
- `overwrite_other_size_labels: true`: `size/S`, `bug`.

Use `size_label_prefix` to identify a different namespace. It does not limit the five configured managed names. Matching is case-insensitive. If humans must retain manual size overrides, use a separate label name outside the five configured names and keep overwriting disabled. This action does not track the provenance of same-name labels or skip classification when a foreign size label exists.

XL comments have an action-specific HTML marker and are matched to the authenticated token author's login. Reruns update the same comment instead of posting duplicates. Other users' marker-containing comments are not changed. Existing comments remain as history when the PR shrinks or commenting is disabled. Changing the token author starts a separate comment.

## Outputs and limits

| Output | Meaning |
| --- | --- |
| `size` | `xs`, `s`, `m`, `l`, or `xl`. |
| `label` | Selected label name. |
| `changed_lines`, `changed_files` | Counts after exclusions. |
| `count_complete` | `true` when all changed files were returned. |
| `config_file` | Loaded config path, or empty. |
| `added_labels`, `removed_labels` | JSON arrays of changes; plans only in dry-run mode. |
| `dry_run` | Effective dry-run setting after file overrides. |

For an initial read-only trial, set `dry_run: "true"`, grant only `contents: read` and `pull-requests: read`, and ensure the base configuration does not override `dry_run` to `false`. Invalid inputs and API errors still fail dry runs. Configuration precedence applies to `dry_run` just like other policy inputs.

Files and labels are paginated. GitHub's file API returns at most 3,000 files: if an incomplete count already reaches XL, the action labels XL and returns `count_complete: false`. Otherwise it fails before writing rather than understating the PR size. Counts in that case are lower bounds. A second PR read rejects head/base changes during calculation. Use per-PR workflow concurrency as shown above to reduce overlapping runs; GitHub does not offer atomic label updates.

The action neither manages label colors/descriptions nor removes repository label definitions. Keep those in the existing `.github/labels*.yaml` synchronization workflow. It only adds/removes labels on the PR.

## Development

From this action's directory, using uv:

```sh
uv export --no-config --locked --script size_labeler.py --format requirements-txt --no-hashes --output-file /tmp/size-labeler-test-requirements.txt
uv run --no-config --no-project --python 3.12 --with-requirements /tmp/size-labeler-test-requirements.txt python -m unittest discover -s tests -v
```

Update versions in the script's PEP 723 metadata and run `uv lock --script size_labeler.py` when updating dependencies. Commit `size_labeler.py.lock`; `--locked` rejects stale metadata rather than silently resolving new versions during action execution. No generated source files are committed.

`tests/contract.json` is byte-identical to the JavaScript alternative's contract: both implementations run the same 68 scenarios for policy decisions, outputs, label/comment changes, configuration, glob/YAML semantics, and failure conditions. Python-specific tests additionally exercise the actual PyGithub SDK with paginated transport responses, Enterprise API paths, output serialization, and validation. CI runs the tests and the real composite's read-only smoke test on Linux AMD64 and ARM64. Live writes are tested through stubs, not performed by the smoke test.

## Dependency decisions

| Dependency | Why it is used | Maintenance evidence checked on 2026-10-24 |
| --- | --- | --- |
| [PyGithub 2.10.0](https://github.com/PyGithub/PyGithub/releases/tag/v2.10.0) | GitHub REST objects, pagination, authentication, and Enterprise support replace a custom HTTP client. | About 7,800 stars; August 2026 release and October 2026 repository activity. |
| [ruamel.yaml 0.19.1](https://yaml.dev/doc/ruamel.yaml/api/) | Safe YAML 1.2 parsing and duplicate-key rejection; a small resolver selects JSON scalar rules to match js-yaml. | Established YAML implementation; pinned January 2026 release. |
| [wcmatch 11.2](https://github.com/facelessuser/wcmatch/releases/tag/11.2) | Globstar, dotfiles, braces, character classes and extglobs without a hand-written glob parser. | Smaller specialist project (about 169 stars), with an October 2026 release and active maintenance. |

The lock file also pins transitive versions and artifact hashes. PyYAML was considered, but preserving JSON-schema booleans and duplicate-key rejection would require more custom parsing. HTTPX/requests alone would require maintaining pagination and GitHub endpoint handling. Pydantic and a CLI framework would add dependencies without removing the cross-field policy validation or the two environment inputs, so they are not included. Tests use the standard-library unittest framework.

This is an alternative to the JavaScript PR, not a follow-up that should be merged alongside it: both define the same action path and update the same reusable workflow. Compare and merge one implementation.

Potential follow-ups are file-count thresholds and `.gitattributes` generated-file exclusion. They change the classification policy or add config parsing beyond the current requirement, so this action initially keeps line-based grading and explicit globs.
