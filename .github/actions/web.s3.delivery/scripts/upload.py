#!/usr/bin/env python3
"""Upload web build artifacts to S3 with pattern-based Cache-Control / Content-Type rules.

Behavior (CloudFront-behavior-like semantics):
  - `UPLOAD_RULES` is an ordered YAML (or JSON, a subset of YAML) array of rules:
      { "pattern": "<gitignore-style glob>", "cache_control": "...", "content_type": "..."? }
  - Each file is matched against rules top-to-bottom; the FIRST matching rule wins.
  - Files matching no rule fall back to `DEFAULT_UPLOAD_RULE` (a YAML/JSON object with
    the same schema minus `pattern`; `content_type` is rejected there because a
    single type cannot be correct for an arbitrary mix of unmatched files).
  - Content-Type: rule override > mimetypes guess (+ `; charset=utf-8` appended
    for text-like types).
  - Upload order is always phased:
      1) non-HTML files  2) HTML files except index.html  3) index.html
    so that in-flight visitors never see an HTML that references not-yet-uploaded assets.
  - Stale remote objects are deleted explicitly via s3api delete-objects
    (never via `aws s3 sync --delete`, which can silently re-upload files
    without headers). Deletion happens AFTER all uploads.

Environment variables (set by action.yaml):
  UPLOAD_SOURCE                  local directory with the prepared artifacts
  UPLOAD_DESTINATION             s3://bucket[/prefix]
  DEFAULT_UPLOAD_RULE            YAML/JSON object; fallback rule (currently `cache_control` only)
  UPLOAD_RULES                   YAML/JSON array of rules (may be empty)
  DELETE_STALE_OBJECTS           "true" | "false"
  DELETE_EXCLUDE_PATTERNS        newline-separated gitignore-style patterns;
                                 stale keys matching these are kept (e.g. old
                                 content-hashed assets still referenced by
                                 cached HTML)
  UPLOAD_METADATA                "k=v,k=v,..." passed to `aws s3 sync --metadata`
"""

from __future__ import annotations

import json
import mimetypes
import os
import subprocess
import sys
import tempfile
from collections import defaultdict
from pathlib import Path, PurePosixPath

try:
    import pathspec
except ImportError:  # pragma: no cover
    sys.stderr.write("::error::python package 'pathspec' is not installed\n")
    sys.exit(1)

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.stderr.write("::error::python package 'pyyaml' is not installed\n")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SOURCE = Path(os.environ["UPLOAD_SOURCE"]).resolve()
DESTINATION = os.environ["UPLOAD_DESTINATION"].rstrip("/")
DEFAULT_RULE_RAW = os.environ["DEFAULT_UPLOAD_RULE"].strip()
RULES_RAW = os.environ.get("UPLOAD_RULES", "").strip() or "[]"
DELETE_STALE_OBJECTS = os.environ.get("DELETE_STALE_OBJECTS", "false").strip() == "true"
DELETE_EXCLUDE_RAW = os.environ.get("DELETE_EXCLUDE_PATTERNS", "")
METADATA = os.environ.get("UPLOAD_METADATA", "").strip()

MAX_LISTED_FILES_PER_BATCH = 10
DELETE_CHUNK_SIZE = 1000  # s3api delete-objects hard limit

# Deterministic MIME mappings regardless of the runner's /etc/mime.types.
# `text/javascript` is the MIME type recommended by the current HTML standard.
_EXTRA_TYPES = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".cjs": "text/javascript",
    ".json": "application/json",
    ".map": "application/json",
    ".webmanifest": "application/manifest+json",
    ".wasm": "application/wasm",
    ".svg": "image/svg+xml",
    ".md": "text/markdown",
    ".txt": "text/plain",
    ".css": "text/css",
    ".html": "text/html",
    ".xml": "application/xml",
    ".ico": "image/vnd.microsoft.icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".avif": "image/avif",
    ".webp": "image/webp",
}
for _ext, _mime in _EXTRA_TYPES.items():
    mimetypes.add_type(_mime, _ext)

# Types that get `; charset=utf-8` appended when not already present.
_CHARSET_EXACT = {
    "application/javascript",
    "application/json",
    "application/manifest+json",
    "application/xml",
    "application/rss+xml",
    "application/atom+xml",
    "image/svg+xml",
}


def _is_charset_type(content_type: str) -> bool:
    return content_type.startswith("text/") or content_type in _CHARSET_EXACT


# ---------------------------------------------------------------------------
# Rule parsing
# ---------------------------------------------------------------------------

def parse_rules(raw: str) -> list[dict]:
    try:
        data = yaml.safe_load(raw)
    except yaml.YAMLError as exc:
        sys.stderr.write(f"::error::upload_rules is not valid YAML/JSON: {exc}\n")
        sys.exit(1)

    if not isinstance(data, list):
        sys.stderr.write("::error::upload_rules must be a YAML/JSON array\n")
        sys.exit(1)

    rules = []
    for i, item in enumerate(data):
        if not isinstance(item, dict):
            sys.stderr.write(f"::error::upload_rules[{i}] must be an object\n")
            sys.exit(1)
        pattern = item.get("pattern")
        cache_control = item.get("cache_control")
        content_type = item.get("content_type")
        if not pattern or not isinstance(pattern, str):
            sys.stderr.write(f"::error::upload_rules[{i}].pattern is required\n")
            sys.exit(1)
        if not cache_control or not isinstance(cache_control, str):
            sys.stderr.write(f"::error::upload_rules[{i}].cache_control is required\n")
            sys.exit(1)
        if content_type is not None and not isinstance(content_type, str):
            sys.stderr.write(f"::error::upload_rules[{i}].content_type must be a string\n")
            sys.exit(1)
        unknown = set(item) - {"pattern", "cache_control", "content_type"}
        if unknown:
            sys.stderr.write(
                f"::warning::upload_rules[{i}] has unknown keys: {sorted(unknown)}\n"
            )
        rules.append(
            {
                "pattern": pattern,
                "cache_control": cache_control.strip(),
                "content_type": content_type.strip() if content_type else None,
                "spec": pathspec.PathSpec.from_lines("gitignore", [pattern]),
                "matched": 0,
            }
        )
    return rules


def parse_default_rule(raw: str) -> str:
    """Parse DEFAULT_UPLOAD_RULE and return its cache_control.

    Accepts a YAML/JSON object so that future properties can be added without
    renaming the input. `pattern` and `content_type` are rejected: the default
    rule matches everything that no pattern matched, so a pattern is
    meaningless and a single content_type cannot be correct for an arbitrary
    mix of file types (Content-Type is always auto-detected for these files).
    """
    try:
        data = yaml.safe_load(raw)
    except yaml.YAMLError as exc:
        sys.stderr.write(f"::error::default_upload_rule is not valid YAML/JSON: {exc}\n")
        sys.exit(1)
    if not isinstance(data, dict):
        sys.stderr.write("::error::default_upload_rule must be a YAML/JSON object\n")
        sys.exit(1)
    for forbidden in ("pattern", "content_type"):
        if forbidden in data:
            sys.stderr.write(
                f"::error::default_upload_rule must not contain '{forbidden}'. "
                "The default rule applies to every file matched by no pattern, so "
                "Content-Type is always auto-detected per file. Use an entry in "
                "upload_rules to override Content-Type for specific patterns.\n"
            )
            sys.exit(1)
    cache_control = data.get("cache_control")
    if not cache_control or not isinstance(cache_control, str):
        sys.stderr.write("::error::default_upload_rule.cache_control is required\n")
        sys.exit(1)
    unknown = set(data) - {"cache_control"}
    if unknown:
        sys.stderr.write(
            f"::warning::default_upload_rule has unknown keys (ignored): {sorted(unknown)}\n"
        )
    return cache_control.strip()


def parse_delete_excludes(raw: str) -> "pathspec.PathSpec | None":
    lines = [line.strip() for line in raw.splitlines() if line.strip()]
    if not lines:
        return None
    return pathspec.PathSpec.from_lines("gitignore", lines)


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

def resolve_content_type(rel: PurePosixPath, rule: dict | None) -> str:
    if rule and rule["content_type"]:
        return rule["content_type"]
    guessed, _ = mimetypes.guess_type(str(rel))
    content_type = guessed or "binary/octet-stream"
    if "charset" not in content_type.lower() and _is_charset_type(content_type):
        content_type += "; charset=utf-8"
    return content_type


def upload_phase(rel: PurePosixPath) -> int:
    """0 = non-HTML assets, 1 = HTML except index.html, 2 = index.html."""
    if rel.name == "index.html":
        return 2
    if rel.suffix.lower() in (".html", ".htm"):
        return 1
    return 0


def classify(files: list[PurePosixPath], rules: list[dict], default_cache_control: str):
    """Group files into batches keyed by (phase, cache_control, content_type)."""
    batches: dict[tuple[int, str, str], list[PurePosixPath]] = defaultdict(list)
    assignments: dict[PurePosixPath, tuple[str, str, str]] = {}

    for rel in files:
        matched_rule = None
        rule_label = "default"
        for idx, rule in enumerate(rules):
            if rule["spec"].match_file(str(rel)):
                matched_rule = rule
                rule["matched"] += 1
                rule_label = f"rule[{idx}] {rule['pattern']!r}"
                break

        cache_control = matched_rule["cache_control"] if matched_rule else default_cache_control
        content_type = resolve_content_type(rel, matched_rule)
        phase = upload_phase(rel)

        batches[(phase, cache_control, content_type)].append(rel)
        assignments[rel] = (rule_label, cache_control, content_type)

    return batches, assignments


# ---------------------------------------------------------------------------
# Upload
# ---------------------------------------------------------------------------

def run(cmd: list[str]) -> subprocess.CompletedProcess:
    print(f"$ {' '.join(cmd)}", flush=True)
    return subprocess.run(cmd, check=True)


def stage_batch(staging_root: Path, index: int, rels: list[PurePosixPath]) -> Path:
    """Hardlink batch files into an isolated directory preserving structure."""
    batch_dir = staging_root / f"batch-{index:03d}"
    for rel in rels:
        dst = batch_dir / Path(rel)
        dst.parent.mkdir(parents=True, exist_ok=True)
        os.link(SOURCE / Path(rel), dst)
    return batch_dir


def upload_batches(batches) -> None:
    staging_root = Path(tempfile.mkdtemp(prefix="s3-delivery-"))
    ordered = sorted(batches.items(), key=lambda kv: (kv[0][0], kv[0][1], kv[0][2]))

    for index, ((phase, cache_control, content_type), rels) in enumerate(ordered):
        phase_name = {0: "assets", 1: "html", 2: "index.html"}[phase]
        print(
            f"\n--- Batch {index + 1}/{len(ordered)} "
            f"[phase={phase_name}] {len(rels)} file(s)\n"
            f"    Cache-Control: {cache_control}\n"
            f"    Content-Type:  {content_type}",
            flush=True,
        )
        for rel in sorted(rels)[:MAX_LISTED_FILES_PER_BATCH]:
            print(f"      {rel}")
        if len(rels) > MAX_LISTED_FILES_PER_BATCH:
            print(f"      ... and {len(rels) - MAX_LISTED_FILES_PER_BATCH} more")

        batch_dir = stage_batch(staging_root, index, rels)
        cmd = [
            "aws", "s3", "sync",
            str(batch_dir), f"{DESTINATION}/",
            "--no-progress",
            "--cache-control", cache_control,
            "--content-type", content_type,
        ]
        if METADATA:
            cmd += ["--metadata", METADATA]
        run(cmd)


# ---------------------------------------------------------------------------
# Stale object deletion
# ---------------------------------------------------------------------------

def parse_destination() -> tuple[str, str]:
    if not DESTINATION.startswith("s3://"):
        sys.stderr.write(f"::error::invalid destination: {DESTINATION}\n")
        sys.exit(1)
    bucket, _, prefix = DESTINATION[len("s3://"):].partition("/")
    return bucket, prefix.strip("/")


def list_remote_keys(bucket: str, key_prefix: str) -> set[str]:
    cmd = [
        "aws", "s3api", "list-objects-v2",
        "--bucket", bucket,
        "--query", "Contents[].Key",
        "--output", "json",
    ]
    if key_prefix:
        cmd += ["--prefix", key_prefix]
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    keys = json.loads(result.stdout or "null") or []
    return set(keys)


def delete_stale(files: list[PurePosixPath], delete_excludes) -> None:
    bucket, prefix = parse_destination()
    key_prefix = f"{prefix}/" if prefix else ""
    expected = {f"{key_prefix}{rel}" for rel in files}

    remote = list_remote_keys(bucket, key_prefix)
    # Defensive: only ever consider keys under our destination prefix.
    remote = {key for key in remote if key.startswith(key_prefix)}
    stale = sorted(remote - expected)

    if delete_excludes is not None:
        kept = [k for k in stale if delete_excludes.match_file(k[len(key_prefix):])]
        stale = [k for k in stale if not delete_excludes.match_file(k[len(key_prefix):])]
        if kept:
            print(f"\nKeeping {len(kept)} stale object(s) matching delete_exclude_patterns")

    if not stale:
        print("\nNo stale objects to delete")
        return

    print(f"\nDeleting {len(stale)} stale object(s):")
    for key in stale[:MAX_LISTED_FILES_PER_BATCH]:
        print(f"  {key}")
    if len(stale) > MAX_LISTED_FILES_PER_BATCH:
        print(f"  ... and {len(stale) - MAX_LISTED_FILES_PER_BATCH} more")

    for start in range(0, len(stale), DELETE_CHUNK_SIZE):
        chunk = stale[start:start + DELETE_CHUNK_SIZE]
        payload = {"Objects": [{"Key": key} for key in chunk], "Quiet": True}
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as handle:
            json.dump(payload, handle)
            payload_path = handle.name
        run([
            "aws", "s3api", "delete-objects",
            "--bucket", bucket,
            "--delete", f"file://{payload_path}",
        ])
        os.unlink(payload_path)


# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

def write_step_summary(rules: list[dict], default_cache_control: str, total: int) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    lines = [
        "### web.s3.delivery",
        "",
        f"Uploaded **{total}** file(s) to `{DESTINATION}`",
        "",
        "| Rule | Pattern | Cache-Control | Matched |",
        "| --- | --- | --- | --- |",
    ]
    for idx, rule in enumerate(rules):
        lines.append(
            f"| {idx} | `{rule['pattern']}` | `{rule['cache_control']}` | {rule['matched']} |"
        )
    default_count = total - sum(rule["matched"] for rule in rules)
    lines.append(f"| — | *(default)* | `{default_cache_control}` | {default_count} |")
    lines.append("")
    with open(summary_path, "a", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")


def main() -> None:
    default_cache_control = parse_default_rule(DEFAULT_RULE_RAW)
    rules = parse_rules(RULES_RAW)
    delete_excludes = parse_delete_excludes(DELETE_EXCLUDE_RAW)

    files = sorted(
        PurePosixPath(path.relative_to(SOURCE).as_posix())
        for path in SOURCE.rglob("*")
        if path.is_file()
    )
    if not files:
        sys.stderr.write("::error::source directory contains no files\n")
        sys.exit(1)

    print(f"Source:      {SOURCE}")
    print(f"Destination: {DESTINATION}")
    print(f"Files:       {len(files)}")
    print(f"Rules:       {len(rules)} custom + default ({default_cache_control!r})")
    print(f"Delete stale objects: {DELETE_STALE_OBJECTS}")

    batches, _assignments = classify(files, rules, default_cache_control)

    for idx, rule in enumerate(rules):
        if rule["matched"] == 0:
            print(
                f"::warning::upload_rules[{idx}] "
                f"(pattern {rule['pattern']!r}) matched no files"
            )

    upload_batches(batches)

    if DELETE_STALE_OBJECTS:
        delete_stale(files, delete_excludes)

    write_step_summary(rules, default_cache_control, len(files))
    print("\nDelivery completed successfully")


if __name__ == "__main__":
    main()
