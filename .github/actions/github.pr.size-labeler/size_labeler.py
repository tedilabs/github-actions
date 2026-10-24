# /// script
# requires-python = ">=3.12,<3.13"
# dependencies = ["PyGithub==2.10.0", "ruamel.yaml==0.19.1", "wcmatch==11.2"]
# ///
"""PR size policy; API pagination, YAML parsing, and globs are library-managed."""

import json
import os
import re
import sys
from pathlib import Path
from uuid import uuid4

from github import Auth, Github, GithubException
from ruamel.yaml import YAML
from ruamel.yaml.resolver import VersionedResolver
from wcmatch import glob

SIZES = ("xs", "s", "m", "l", "xl")
DEFAULTS = {
    "xs_label": "size/XS", "xs_max_size": 15,
    "s_label": "size/S", "s_max_size": 100,
    "m_label": "size/M", "m_max_size": 500,
    "l_label": "size/L", "l_max_size": 1000,
    "xl_label": "size/XL", "files_to_ignore": [],
    "ignore_file_deletions": True, "ignore_line_deletions": False,
    "overwrite_other_size_labels": False, "size_label_prefix": "size/",
    "fail_if_xl": False, "dry_run": False,
    "message_if_xl": "This PR has too many changes. Please make sure you are NOT addressing multiple issues with one PR.",
}
DEFAULT_PATHS = (".github/size-labeler.yaml", ".github/size-labeler.yml")
COMMENT_MARKER = "<!-- tedilabs:github.pr.size-labeler:xl -->"


class ConfigResolver(VersionedResolver):
    @property
    def versioned_resolver(self):
        # JSON schema, matching js-yaml: no YAML 1.1 booleans, dates, octal, or merge keys.
        return {None: [
            ("tag:yaml.org,2002:null", re.compile(r"^null$")),
            ("tag:yaml.org,2002:bool", re.compile(r"^(?:true|false)$")),
            ("tag:yaml.org,2002:int", re.compile(r"^-?(?:0|[1-9][0-9]*)$")),
            ("tag:yaml.org,2002:float", re.compile(r"^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$")),
        ]}


def parse_config(text):
    parser = YAML(typ="safe", pure=True)
    parser.Resolver = ConfigResolver
    documents = list(parser.load_all(text))
    if len(documents) > 1:
        raise ValueError("Configuration must contain only one YAML document.")
    config = documents[0] if documents else {}
    if not isinstance(config, dict):
        raise ValueError("Configuration must be a YAML mapping.")
    for key in config:
        if key not in DEFAULTS:
            raise ValueError(f"Unknown configuration key: {key}")
    return config


def resolve_options(inputs, config):
    options = {**DEFAULTS, **{
        key: value for key, value in inputs.items()
        if key in DEFAULTS and (value != "" or key in ("message_if_xl", "files_to_ignore"))
    }, **config}
    for key, default in DEFAULTS.items():
        if type(default) is bool:
            value = options[key]
            if type(value) is not bool and value not in ("true", "false"):
                raise ValueError(f"{key} must be true or false.")
            options[key] = value is True or value == "true"
    previous, names = 0, []
    for size in SIZES:
        label = options[f"{size}_label"]
        if not isinstance(label, str) or not label.strip() or len(label.encode("utf-16-le")) // 2 > 50:
            raise ValueError(f"{size}_label must be a nonempty label of at most 50 characters.")
        names.append(label.lower())
        if size == "xl":
            continue
        key = f"{size}_max_size"
        raw = options[key]
        if isinstance(raw, str) and re.fullmatch(r"[0-9]+", raw):
            raw = int(raw)
        if type(raw) not in (int, float) or not previous < raw <= 2**53 - 1 or int(raw) != raw:
            raise ValueError("Size thresholds must be positive, strictly increasing integers.")
        options[key] = previous = int(raw)
    if len(set(names)) != len(names):
        raise ValueError("Size labels must be distinct (case-insensitive).")
    if not isinstance(options["size_label_prefix"], str) or not options["size_label_prefix"].strip():
        raise ValueError("size_label_prefix must be a nonempty string.")
    if not isinstance(options["message_if_xl"], str):
        raise ValueError("message_if_xl must be a string.")
    patterns = options["files_to_ignore"]
    if isinstance(patterns, str):
        patterns = [re.sub(r'''^(["'])(.*)\1$''', r"\2", part)
                    for part in re.findall(r'''"[^"]*"|'[^']*'|\S+''', patterns)]
    if not isinstance(patterns, list) or any(not isinstance(p, str) or not p for p in patterns):
        raise ValueError("files_to_ignore must be a string or a YAML list of nonempty glob patterns.")
    options["files_to_ignore"] = patterns
    return options


def load_config(repository, ref, explicit_path):
    for path in (explicit_path,) if explicit_path else DEFAULT_PATHS:
        try:
            file = repository.get_contents(path, ref=ref)
        except GithubException as error:
            if error.status == 404 and not explicit_path:
                continue
            raise
        if isinstance(file, list) or file.type != "file" or file.encoding != "base64":
            raise ValueError(f"Configuration must be a regular UTF-8 file smaller than 1 MB: {path}")
        return path, parse_config(file.decoded_content.decode("utf-8"))
    return "", {}


def ignored_matcher(patterns):
    matchers = []
    for pattern in patterns:
        negate = False
        while pattern.startswith("!") and not pattern.startswith("!("):
            negate = not negate
            pattern = pattern[1:]
        matcher = glob.compile(pattern, flags=glob.GLOBSTAR | glob.DOTGLOB | glob.BRACE | glob.EXTGLOB | glob.FORCEUNIX)
        matchers.append((matcher, negate))
    # Each list entry is an independent alternative, including negations.
    return lambda name: any(matcher.match(name) != negate for matcher, negate in matchers)


def run(client, repository_name, event, inputs, core):
    raw_number = inputs.get("pr_number") or event.get("pull_request", {}).get("number")
    if not str(raw_number).isdigit() or not 0 < int(raw_number) <= 2**53 - 1:
        raise ValueError("A pull request event or a positive pr_number input is required.")
    repository = client.get_repo(repository_name)
    pr = repository.get_pull(int(raw_number))
    config_path, config = load_config(repository, pr.base.sha, inputs.get("config_file"))
    options = resolve_options(inputs, config)
    core.info(f"Configuration: {config_path or '(action inputs)'} at base {pr.base.sha}")
    ignored = ignored_matcher(options["files_to_ignore"])
    lines = files = seen = 0
    for file in pr.get_files():
        seen += 1
        if (options["ignore_file_deletions"] and file.status == "removed") or ignored(file.filename):
            continue
        files += 1
        lines += file.additions + (0 if options["ignore_line_deletions"] else file.deletions)
    complete = seen == pr.changed_files
    if not complete and lines < options["l_max_size"]:
        raise ValueError(f"Only {seen} of {pr.changed_files} changed files were returned; cannot assign an accurate size label.")
    if not complete:
        core.warning("GitHub truncated the file list. Counts are lower bounds; the XL classification is certain.")
    size = next(size for size in SIZES if size == "xl" or lines < options[f"{size}_max_size"])
    label = options[f"{size}_label"]
    core.info(f"{'At least ' if not complete else ''}{lines} changed lines in {files} included files: {label}")
    latest = repository.get_pull(pr.number)
    if latest.head.sha != pr.head.sha or latest.base.sha != pr.base.sha:
        raise ValueError("The PR changed during size calculation. Rerun the action for the current revision.")
    existing = [entry.name for entry in latest.get_labels()]
    managed = {options[f"{size}_label"].lower() for size in SIZES}
    add = [] if label.lower() in {name.lower() for name in existing} else [label]
    remove = [name for name in existing if name.lower() != label.lower() and (
        name.lower() in managed or (options["overwrite_other_size_labels"] and name.lower().startswith(options["size_label_prefix"].lower()))
    )]
    for key, value in {
        "size": size, "label": label, "changed_lines": lines, "changed_files": files,
        "count_complete": complete, "config_file": config_path, "dry_run": options["dry_run"],
        "added_labels": json.dumps(add, ensure_ascii=False, separators=(",", ":")),
        "removed_labels": json.dumps(remove, ensure_ascii=False, separators=(",", ":")),
    }.items():
        core.output(key, value)
    if options["dry_run"]:
        core.info(f"Dry run: add {add}, remove {remove}; no writes or XL failure enforcement.")
        return
    if add:
        latest.add_to_labels(*add)
    for name in remove:
        try:
            latest.remove_from_labels(name)
        except GithubException as error:
            if error.status != 404:
                raise
    if size == "xl" and options["message_if_xl"]:
        _, data = client.requester.graphql_query("{ viewer { login } }", {})
        author = data["data"]["viewer"]["login"]
        body = f"{COMMENT_MARKER}\n{options['message_if_xl']}"
        comment = next((c for c in latest.get_issue_comments() if c.user and c.user.login == author and (c.body or "").startswith(COMMENT_MARKER)), None)
        if comment is None:
            latest.create_issue_comment(body)
        elif comment.body != body:
            comment.edit(body)
    if size == "xl" and options["fail_if_xl"]:
        core.fail("The PR reaches the XL size threshold.")


class Actions:
    failed = False

    def info(self, message):
        print(message)

    def annotation(self, level, message):
        escaped = str(message).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
        print(f"::{level}::{escaped}")

    def warning(self, message):
        self.annotation("warning", message)

    def fail(self, message):
        self.failed = True
        self.annotation("error", message)

    def output(self, key, value):
        text = json.dumps(value) if not isinstance(value, str) else value
        delimiter = uuid4().hex
        with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as stream:
            stream.write(f"{key}<<{delimiter}\n{text}\n{delimiter}\n")


def main():
    core = Actions()
    try:
        inputs = json.loads(os.environ["SIZE_LABELER_INPUTS"])
        token = inputs.get("GITHUB_TOKEN") or os.environ["GITHUB_TOKEN"]
        api_url = inputs.get("github_api_url") or os.environ["GITHUB_API_URL"]
        event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
        with Github(auth=Auth.Token(token), base_url=api_url, per_page=100, lazy=True) as client:
            run(client, os.environ["GITHUB_REPOSITORY"], event, inputs, core)
    except Exception as error:
        core.fail(error)
    return int(core.failed)


if __name__ == "__main__":
    sys.exit(main())
