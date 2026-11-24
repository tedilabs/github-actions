# Terraform - Docs

Generate Terraform documentation or check that it is up to date. The caller must
install `terraform-docs` on `PATH`. See [action.yaml](action.yaml) for all inputs
and outputs.

## Skip manually maintained documentation

Set `skip_if_missing_markers: "true"` to skip an output file that contains neither
`<!-- BEGIN_TF_DOCS -->` nor `<!-- END_TF_DOCS -->`. The action reports
`skipped=true` without running `terraform-docs` or modifying the file. This applies
to both generation and check mode.

```yaml
- uses: tedilabs/github-actions/.github/actions/terraform.docs@main
  with:
    target_dir: examples/service
    check: "true"
    skip_if_missing_markers: "true"
```

For the reusable module or workspace integration workflow, pass the corresponding boolean:

```yaml
with:
  terraform_docs_enabled: true
  terraform_docs_skip_if_missing_markers: true
```

The input defaults to `false`, preserving existing behavior. It only applies in
non-recursive mode; recursive runs continue to process the main module and its
submodules as before. Only the standard markers above are recognized, so leave
the option disabled when using custom template markers. A file containing only
one marker is passed to `terraform-docs`, which reports the malformed pair.
Missing output files are already skipped in non-recursive mode regardless of
this input.

This input controls this action only. A separate local pre-commit hook must be
configured independently if it should also leave manually maintained files alone.

## Tests

With Node.js 24 and `terraform-docs` v0.24.0 on `PATH`, run:

```sh
node --test .github/actions/terraform.docs/tests/docs.test.cjs
```

The tests execute the action's shell scripts against temporary Terraform modules.
