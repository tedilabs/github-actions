# GitHub - PR Size Labeler

Label pull requests as XS, S, M, L, or XL using additions and deletions reported by GitHub. This composite action uses `actions/github-script@v9` and a bundled JavaScript implementation. It runs on AMD64 and ARM64 without Docker, checkout, `gh`, `jq`, or an npm install at runtime. Self-hosted runners need Actions Runner v2.327.1 or newer for Node 24.

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

With an empty `config_file`, the action tries `.github/size-labelers.yaml` and then `.github/size-labeler.yml`. The first existing file wins; files are not merged. If neither exists, inputs are used. These filenames deliberately include the plural `size-labelers.yaml` and singular `size-labeler.yml`.

Set `config_file: .github/custom-size.yaml` to read only that path. An explicitly selected missing file fails, while a missing auto-discovery file is optional. Invalid configuration and permission errors always fail before changes are made.

Files use the same flat setting names as action inputs. Only policy settings in the table below can be overridden. `GITHUB_TOKEN`, `github_api_url`, `pr_number`, and `config_file` remain invocation inputs. Unknown keys, duplicate YAML keys, multiple documents, invalid booleans, and non-increasing thresholds fail validation. An empty file or `{}` applies no overrides.

For example, `.github/size-labelers.yaml`:

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

Patterns match the current repository-relative filename, including dotfiles. Use `**/*.lock` for lockfiles at any depth. Quote whitespace-containing patterns in string inputs, or use a YAML list. Rename matching uses the new path. Patterns use picomatch glob syntax; they are not regular expressions. An excluded file contributes neither lines nor a file count. Binary-only changes with zero additions/deletions contribute zero lines. File counts are informational and do not affect the size grade.

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

From this action's directory, using Node 24:

```sh
npm ci --ignore-scripts
npm test
npm run build
git diff --exit-code -- dist
```

Commit regenerated `dist/` when changing source or dependencies. The bundle includes the YAML and glob libraries and their license texts. Consumers never install these dependencies. The dedicated CI workflow runs behavior tests, a reproducible bundle check, and a read-only composite smoke test on AMD64 and ARM64.

Potential follow-ups are file-count thresholds and `.gitattributes` generated-file exclusion. They change the classification policy or add config parsing beyond the current requirement, so this action initially keeps line-based grading and explicit globs.
