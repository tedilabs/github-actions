# AWS - CodeArtifact Configure Credentials

Fetch a CodeArtifact authorization token and a repository endpoint using the job's
existing AWS credentials. Supports Python (`pypi`), Node.js (`npm`), and JVM
(`maven`) package formats without choosing a package manager or modifying its
configuration files.

## Requirements

- Bash and AWS CLI v2 on the runner. No action-specific runtime dependencies or
  architecture-specific binaries are installed; Linux amd64 and arm64 are tested.
- AWS credentials configured before this action, for example with
  [`aws.configure-credentials`](../aws.configure-credentials/action.yaml).
- `codeartifact:GetAuthorizationToken` on the domain,
  `codeartifact:GetRepositoryEndpoint` on the repository, and
  `sts:GetServiceBearerToken` with the `sts:AWSServiceName` condition set to
  `codeartifact.amazonaws.com`.

Downloading packages additionally requires `codeartifact:ReadFromRepository`.
Publishing requires the corresponding package write permissions, such as
`codeartifact:PublishPackageVersion` and `codeartifact:PutPackageMetadata`.
Cross-account access also requires the appropriate domain/repository policies.
The action does not grant permissions or create repositories.

## Usage

Install AWS CLI v2 first, for example through `mise.setup-tools` and the caller's
`mise.toml`. The following steps assume it is available on `PATH`.

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  package:
    runs-on: ubuntu-24.04
    steps:
    - name: Configure AWS Credentials
      uses: tedilabs/github-actions/.github/actions/aws.configure-credentials@main
      with:
        aws_region: ap-northeast-1
        aws_github_oidc_iam_role: ${{ secrets.AWS_GITHUB_OIDC_IAM_ROLE }}
        # Optional: assume a separate CodeArtifact reader or publisher role.
        aws_chained_iam_role: ${{ secrets.CODEARTIFACT_IAM_ROLE }}

    - name: Configure CodeArtifact Credentials
      id: codeartifact
      uses: tedilabs/github-actions/.github/actions/aws.codeartifact.configure-credentials@main
      with:
        aws_region: ap-northeast-1
        domain: example
        domain_owner: "111122223333"
        repository: internal
        format: pypi
```

The `domain_owner` is the account owning the domain, which may differ from the
account of the assumed role. `format` selects an endpoint, not an access level.

## Inputs and outputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `aws_region` | Yes | | AWS region of the domain. |
| `domain` | Yes | | CodeArtifact domain name. |
| `domain_owner` | Yes | | AWS account ID owning the domain. |
| `repository` | Yes | | CodeArtifact repository name. |
| `format` | Yes | | `pypi`, `npm`, or `maven`. |
| `token_duration_seconds` | No | `0` | `0` or an integer from `900` through `43200`. |

The default token duration of `0` uses the remaining lifetime of the assumed-role
session. When using IAM user credentials, specify a duration from `900` through
`43200` instead. Long-running jobs must renew AWS credentials and rerun this action
before the credentials expire. See [AWS token authentication](https://docs.aws.amazon.com/codeartifact/latest/ug/tokens-authentication.html).

After both AWS API calls succeed, subsequent steps in the same job receive:

- `CODEARTIFACT_AUTH_TOKEN`: masked authorization token.
- `CODEARTIFACT_REPOSITORY_ENDPOINT`: endpoint returned by AWS for `format`.

The endpoint is also available as `steps.<id>.outputs.repository_endpoint`.
There is intentionally no token output. Authenticate separately in each job;
do not put the token in artifacts, caches, or job outputs. Calling this action
again replaces both environment variables for subsequent steps. An unsuccessful
call exports nothing new and fails the step; do not continue after that failure.

## Package manager configuration

The caller configures its package manager with these environment variables:

| Client | How to use the credentials |
| --- | --- |
| uv | Configure a named index, with username `aws` and the token as its password. The index URL is the PyPI endpoint plus `simple/`; the publish URL is the endpoint itself. |
| pip / Twine | pip uses the PyPI endpoint plus `simple/`. Twine uses the endpoint itself with username `aws` and the token as its password. |
| npm / pnpm | Configure the npm endpoint as the registry and reference the token in registry-scoped authentication settings. |
| Yarn | Configure the npm registry and authentication in the project's Yarn configuration. |
| Maven / Gradle | Configure the Maven endpoint with username `aws` and the token as its password. |

The action preserves the endpoint returned by AWS, including its trailing slash.
It does not append `/simple/` or embed credentials in URLs. Package manager
configuration and cleanup remain under the caller's control.

## Tests

Run the regression tests with uv (PyYAML is a test-only dependency):

```sh
uv run .github/actions/aws.codeartifact.configure-credentials/tests/test_action.py
```

The tests execute the actual inline shell step with a mocked AWS CLI. CI also
invokes the composite action and verifies its outputs and subsequent-step
environment on Linux amd64 and arm64. These tests need no AWS credentials and do
not prove access to a live CodeArtifact repository.
