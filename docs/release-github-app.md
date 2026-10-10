# GitHub App for Release Automation

This guide sets up the GitHub App that release workflows (such as `release-please`) use to open release pull requests, push version bumps, and create tags and GitHub releases.

Workflows never store a long-lived release token. They store the App's client ID and private key as organization secrets, and mint a short-lived token in the step `release-github-token` at run time.

## Why a GitHub App

| Option | Problem |
|---|---|
| `GITHUB_TOKEN` | Events created with it do not trigger other workflows. CI does not run on the release pull request, and tags or releases it creates do not trigger `push: tags` or `release` workflows. |
| Personal access token | Tied to a person, long-lived, and usually broader than needed. Releases stop when that person leaves or the token expires. |
| **GitHub App** | Owned by the organization, limited to the permissions below, installed only on selected repositories, and its installation tokens expire after one hour. |

## 1. Create the App

Go to **Organization settings → Developer settings → GitHub Apps → New GitHub App** and fill in:

| Field | Value |
|---|---|
| GitHub App name | `tedilabs-release` (any unique name) |
| Homepage URL | `https://github.com/tedilabs` |
| Webhook → Active | **Unchecked**. Release workflows call the API; the App does not need events. |
| Where can this GitHub App be installed? | **Only on this account** |

### Permissions

Grant only these **repository permissions**. Leave every organization and account permission at **No access**, and subscribe to no events.

| Repository permission | Access | Used for |
|---|---|---|
| Contents | Read and write | Push the release branch (the `VERSION` bump), create tags and GitHub releases |
| Pull requests | Read and write | Open and update the release pull request |
| Issues | Read and write | Create and apply the `autorelease: pending` / `autorelease: tagged` labels (labels use the Issues API) |
| Metadata | Read-only | Required for every App; selected automatically |

`release-please` documents the same three write permissions (`contents`, `issues`, `pull-requests`) for its workflow token.

Do not grant **Workflows**. A release pull request only changes `VERSION` (and a changelog, if enabled). Add it only if a release ever needs to modify files under `.github/workflows/`.

## 2. Generate credentials

On the App's settings page:

1. Copy the **Client ID** (it starts with `Iv`). `actions/create-github-app-token` v3 takes `client-id`; the numeric App ID input `app-id` is deprecated.
2. Under **Private keys**, select **Generate a private key**. A `.pem` file is downloaded. Store it as a secret in step 4, then delete the local file.

## 3. Install the App

On the App's settings page, select **Install App → tedilabs → Only select repositories** and choose the repositories that release with it. Start with the pilot repository (`terraform-aws-account`) and add more as the rollout proceeds.

## 4. Store the credentials as organization secrets

Use **Selected repositories** visibility and keep the list in sync with the App installation.

| Secret | Value |
|---|---|
| `RELEASE_GITHUB_APP_CLIENT_ID` | The Client ID from step 2 |
| `RELEASE_GITHUB_APP_PRIVATE_KEY` | The full contents of the `.pem` file from step 2 |

With the GitHub CLI (requires an organization admin):

```sh
gh secret set RELEASE_GITHUB_APP_CLIENT_ID --org tedilabs --visibility selected --repos terraform-aws-account
gh secret set RELEASE_GITHUB_APP_PRIVATE_KEY --org tedilabs --visibility selected --repos terraform-aws-account < tedilabs-release.private-key.pem
```

To add a repository later, add it to the App installation **and** to the visibility of both secrets.

## 5. Use it in a workflow

```yaml
permissions: {}

jobs:
  release-please:
    name: Release Please
    runs-on: ubuntu-latest

    steps:
    - name: Generate GitHub App Token
      id: release-github-token
      uses: actions/create-github-app-token@v3
      with:
        client-id: ${{ secrets.RELEASE_GITHUB_APP_CLIENT_ID }}
        private-key: ${{ secrets.RELEASE_GITHUB_APP_PRIVATE_KEY }}
        # Narrow the token to what this job needs, even if the App has more.
        permission-contents: write
        permission-issues: write
        permission-pull-requests: write

    - name: Release Please
      uses: googleapis/release-please-action@v5
      with:
        token: ${{ steps.release-github-token.outputs.token }}
```

The token is scoped to the current repository by default and is revoked when the job ends. The workflow-level `permissions: {}` drops the unused `GITHUB_TOKEN` permissions.

## What changes for maintainers

- Release pull requests and releases are authored by `tedilabs-release[bot]` (the App name followed by `[bot]`).
- CI runs on release pull requests, and tags or releases created by the App trigger `push: tags` and `release` workflows.
- When `main` is protected by a ruleset later, add the App as a bypass actor only if the release flow needs to push to `main` directly. `release-please` itself goes through a pull request.

## Rotating or revoking

- **Rotate the key**: generate a new private key, update `RELEASE_GITHUB_APP_PRIVATE_KEY`, then delete the old key on the App's settings page.
- **Stop releases from a repository**: remove it from the App installation and from the secret visibility.
- **Suspected leak**: delete the private key on the App's settings page. Every token minted from it stops working within an hour, and new tokens cannot be minted.
