#!/usr/bin/env bash
# Set the release GitHub App credentials as repository secrets in every Terraform module repository.
#
# On the GitHub Free plan, private repositories cannot use organization secrets, so this sets repository
# secrets instead. The values are read from environment variables and passed to `gh` through standard input,
# so they never appear in command-line arguments.
#
# Usage:
#   export RELEASE_GITHUB_APP_ID=123456
#   export RELEASE_GITHUB_APP_PRIVATE_KEY="$(cat tedilabs-release.private-key.pem)"
#   scripts/set-release-github-app-secrets.sh [--dry-run] [REPOSITORY...]
#
# Without REPOSITORY arguments, it targets every non-archived repository of the owner (`GITHUB_OWNER`, defaults to
# `tedilabs`) whose name starts with `terraform-` and that has the `type-module` topic.
# Requires `gh` authenticated as a user who can manage secrets of those repositories.
set -euo pipefail

owner="${GITHUB_OWNER:-tedilabs}"
dry_run=false
repos=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=true ;;
    -h | --help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) echo "[x] Unknown option: $arg" >&2; exit 1 ;;
    *) repos+=("$arg") ;;
  esac
done

: "${RELEASE_GITHUB_APP_ID:?Set RELEASE_GITHUB_APP_ID to the numeric App ID.}"
: "${RELEASE_GITHUB_APP_PRIVATE_KEY:?Set RELEASE_GITHUB_APP_PRIVATE_KEY to the contents of the private key (.pem).}"
if [[ ! $RELEASE_GITHUB_APP_ID =~ ^[0-9]+$ ]]; then
  echo "[x] RELEASE_GITHUB_APP_ID must be the numeric App ID, not the Client ID." >&2
  exit 1
fi
if [[ $RELEASE_GITHUB_APP_PRIVATE_KEY != "-----BEGIN "*"PRIVATE KEY-----"* ]]; then
  echo "[x] RELEASE_GITHUB_APP_PRIVATE_KEY must be the contents of the .pem file, not its path." >&2
  exit 1
fi

if [ ${#repos[@]} -eq 0 ]; then
  while IFS= read -r repo; do
    repos+=("$repo")
  done < <(gh repo list "$owner" --topic type-module --no-archived --limit 1000 --json name \
    --jq '.[].name | select(startswith("terraform-"))' | sort)
fi
if [ ${#repos[@]} -eq 0 ]; then
  echo "[x] No repositories found in '${owner}'." >&2
  exit 1
fi
echo "[!] Setting RELEASE_GITHUB_APP_ID and RELEASE_GITHUB_APP_PRIVATE_KEY in ${#repos[@]} repositories of '${owner}'."

failed=()
for repo in "${repos[@]}"; do
  if $dry_run; then
    echo "    would set: ${owner}/${repo}"
    continue
  fi
  if printf '%s' "$RELEASE_GITHUB_APP_ID" | gh secret set RELEASE_GITHUB_APP_ID --repo "${owner}/${repo}" > /dev/null \
    && printf '%s' "$RELEASE_GITHUB_APP_PRIVATE_KEY" | gh secret set RELEASE_GITHUB_APP_PRIVATE_KEY --repo "${owner}/${repo}" > /dev/null; then
    echo "    set: ${owner}/${repo}"
  else
    echo "[x] failed: ${owner}/${repo}" >&2
    failed+=("$repo")
  fi
done

if [ ${#failed[@]} -gt 0 ]; then
  echo "[x] Failed in ${#failed[@]} repositories: ${failed[*]}" >&2
  exit 1
fi
if ! $dry_run; then
  echo "[!] Done. Make sure the GitHub App is installed on the same repositories."
fi
