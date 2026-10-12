# GitHub - Issue Welcome

Welcome each author on their first issue and first pull request in a repository,
independently. Open, closed, and merged contributions all count as history. The
action checks every page until an earlier contribution of the same type is found.
Later contributions do not prevent a delayed run from welcoming the first one.

Only `issues`, `pull_request`, and `pull_request_target` events with the `opened`
activity are handled. Empty messages disable greetings for the corresponding type.
Messages are passed as data and retain their Markdown formatting.

## Reusable workflow

The reusable workflow supplies default messages, falls back to `github.token` when
no token secret is provided, and serializes runs for the same issue or PR. Callers
grant the permissions needed for their events; a PR-only caller needs only
`pull-requests: write`.

```yaml
name: Welcome

on:
  issues:
    types: [opened]
  pull_request_target:
    types: [opened]

jobs:
  welcome:
    uses: tedilabs/github-actions/.github/workflows/github.issue.welcome.yaml@main
    permissions:
      issues: write
      pull-requests: write
    with:
      issue_message: Thanks for opening your first issue!
      pr_message: Thanks for opening your first pull request!
```

No checkout is needed. For fork PRs, use `pull_request_target` and do not check out
or run the PR's code in the privileged welcome job.

## Direct action use

The composite action takes `issue_message`, `pr_message`, and `github_token` inputs.
Messages have no defaults at the action level. `github_token` defaults to
`${{ github.token }}`. See [action.yaml](action.yaml) for inputs and outputs.

Direct callers must set job concurrency to prevent concurrent runs from both
posting before either sees the other's comment:

```yaml
concurrency:
  group: github-issue-welcome-${{ github.repository }}-${{ github.event.issue.number || github.event.pull_request.number }}
  cancel-in-progress: false
```

The hidden `<!-- tedilabs/github.issue.welcome -->` marker identifies an existing
welcome comment, including comments posted with a personal access token. Reruns
leave marked comments unchanged, even if the configured message changes. Unmarked
comments from `actions/first-interaction` are not recognized as this action's comments.
API errors fail the step rather than treating an unreadable history as empty.

## Tests

Run the regression tests with Node.js 24 or later; no packages need to be installed:

```sh
node --test .github/actions/github.issue.welcome/tests/welcome.test.cjs
```

The tests execute the inline script from `action.yaml` with mocked GitHub APIs.
They also run in this repository's GitHub Actions workflow.
