# Terraform - Test

Initialize a module with `terraform init -backend=false -input=false` and run
`terraform test` once. Like `terraform.validate`, this action expects Terraform
on `PATH`, uses `shell.run` to capture output, and adds failure details to the job
summary. Install Terraform with the repository's `mise.setup-tools` action or
another setup step; disable the wrapper when using `hashicorp/setup-terraform`.

```yaml
- name: Test Terraform Module
  id: test
  uses: tedilabs/github-actions/.github/actions/terraform.test@main
  with:
    target_dir: modules/example
    test_directory: tests
    filters: |
      tests/main.tftest.hcl
      tests/outputs.tftest.hcl
    var_files: |
      fixtures/common.tfvars
      fixtures/test.tfvars
    vars: |
      environment=test
      labels={ owner = "platform team" }
    parallelism: "5"
    junit_xml: test-results.xml
```

## Inputs and outputs

See [action.yaml](action.yaml) for the complete interface and defaults. Inputs map
to the [Terraform test CLI options](https://developer.hashicorp.com/terraform/cli/commands/test):

| Input | Behavior |
| --- | --- |
| `target_dir` | Working directory for init and test; defaults to `./`. |
| `workspace` | Exports `TF_WORKSPACE` for both commands when provided. |
| `test_directory` | Passes `-test-directory` to both commands; defaults to `tests`. |
| `filters` | One `-filter` per non-empty line. |
| `var_files` | One `-var-file` per non-empty line, in order. |
| `vars` | One `-var` assignment per non-empty line, after all variable files. |
| `format` | `text` (default) or `json` (`-json`). |
| `verbose` | Passes `-verbose` when `true`; defaults to `false`. |
| `parallelism` | Passes `-parallelism`; omitted by default. |
| `junit_xml` | Passes `-junit-xml`; omitted by default. |
| `cloud_run` | Passes `-cloud-run` and skips local init; omitted by default. |
| `annotations_enabled` | Annotates captured diagnostics on failure; defaults to `true`. |

All relative paths are resolved against `target_dir`, including filters, variable
files, and the JUnit report. List inputs preserve spaces and HCL expressions;
each line is one argument, with no shell quoting or expansion. Variable files are
loaded before explicit assignments. Terraform's test-file and run-block variable
precedence still applies. `TF_VAR_*` environment variables can supply secrets.

Terraform 1.6 or later is required. `junit_xml` requires 1.11 or later, and
`parallelism` requires 1.12 or later. These flags are only passed when requested,
so the default invocation works with Terraform 1.6. Test-only configurations
without root `.tf` files require Terraform 1.12 or later for initialization.

The action returns `stdout`, `stderr`, and `exitcode` from test, or from init when
initialization fails. It still fails on non-zero exit codes; use caller-level
`continue-on-error: true` when subsequent steps need to inspect failure outputs.
With `format: json`, test stdout is a newline-delimited JSON message stream.
Init always produces text output. Failure summaries and annotations read the
captured output; tests are never repeated to collect diagnostics.

The action returns `skipped: 'true'` when there are no `.tftest.hcl` or
`.tftest.json` files directly in `target_dir` or the selected `test_directory`.
Other outputs are empty when skipped. Discovery is non-recursive, matching
Terraform; tests directly in `target_dir` are always considered. Filters select
from discovered test files using Terraform's own matching behavior.

## Reports and remote execution

The JUnit report is written by Terraform on both passing and failing test runs.
Its parent directory must already exist. Upload it in a separate caller step
with `if: always()` if it should be retained as an artifact. For the example
above, the repository-relative report path is `modules/example/test-results.xml`.

For remote execution, set `cloud_run` to a private registry module source, such
as `app.terraform.io/example/module/aws`, and configure credentials before calling
the action. HCP Terraform installs providers and modules remotely. `cloud_run`
and `junit_xml` cannot be combined.

Test files control whether Terraform plans or applies. Apply tests can create
real resources, and Terraform attempts cleanup at the end; cleanup failures stay
in the captured output and failure summary.

## Development

With Terraform, Bash, jq, and Python with PyYAML installed:

```sh
python3 .github/actions/terraform.test/tests/test_action.py
```

Alternatively, use `uv run --with pyyaml python` in place of `python3`.
The tests execute the action's shell snippets and shared output/summary helpers
against temporary, provider-free Terraform fixtures. Remote argument forwarding
is tested with a stub; no HCP Terraform run or cloud resources are created.
