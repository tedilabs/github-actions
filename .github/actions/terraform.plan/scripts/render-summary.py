#!/usr/bin/env python3
"""Render a Terraform plan as the Markdown summary of the `terraform.plan` action.

The per-resource diffs are sliced out of `terraform show -no-color`, so they read exactly as
Terraform prints them and keep its redaction of values marked sensitive. Drift has no textual
rendering in Terraform, so it is diffed from the JSON plan instead.
"""

from __future__ import annotations

import argparse
import json
import re
import sys

# The phrase Terraform puts after the address in `  # <address> <phrase>`, and how to show it.
# Terraform's own notation, coloured so a block can be placed at a glance.
SIGNS = {
    "create": "🟩 <code>+</code>",
    "update": "🟨 <code>~</code>",
    "destroy": "🟥 <code>-</code>",
    "replace": "🟧 <code>±</code>",
    "read": "🟦 <code>&lt;=</code>",
    "move": "🟪 <code>-&gt;</code>",
    "import": "🟦 <code>+</code>",
    "drift": "🟪 <code>~</code>",
    "change": "⬜ <code>?</code>",
}
COUNT_SIGNS = {"create": "🟩 +", "update": "🟨 ~", "destroy": "🟥 -", "replace": "🟧 ±"}
ACTIONS = [
    ("will be created", "create"),
    ("will be updated in-place", "update"),
    ("must be replaced", "replace"),
    ("will be destroyed", "destroy"),
    ("will be read during apply", "read"),
    ("has moved to", "move"),
    ("will be imported", "import"),
]
# The report puts each target under an `<h2>`, so a section inside one sits a level below it.
HEADING = "###"
# Generous space around the divider, so the groups of the headline read apart at a glance.
GROUP_DIVIDER = "&nbsp;&nbsp;·&nbsp;&nbsp;"
RESOURCE_HEADER = re.compile(r"^  # (?P<address>\S.*?) (?P<phrase>will be .*|must be .*|has moved to .*)$")
# A `  # (because ...)` line continues the header above it rather than starting a new resource.
HEADER_NOTE = re.compile(r"^  # \((?P<note>.*)\)$")


def slice_resources(text: str) -> list[dict]:
    """Split the readable plan into one chunk per resource, keeping Terraform's own formatting."""
    resources: list[dict] = []
    current: dict | None = None
    for line in text.splitlines():
        header = RESOURCE_HEADER.match(line)
        if header:
            action = "change"
            for phrase, phrase_action in ACTIONS:
                if header.group("phrase").startswith(phrase):
                    action = phrase_action
                    break
            current = {
                "address": header.group("address"),
                "phrase": header.group("phrase"),
                "sign": SIGNS.get(action, SIGNS["change"]),
                "action": action,
                "note": "",
                "lines": [],
            }
            resources.append(current)
            continue

        note = HEADER_NOTE.match(line)
        if note and current is not None and not current["lines"]:
            current["note"] = note.group("note")
            continue

        if current is not None:
            # Everything up to the blank line that follows the closing brace belongs to this resource.
            if line.strip() == "" and current["lines"] and current["lines"][-1].strip() in ("}", "]"):
                current = None
                continue
            current["lines"].append(line)
    return resources


def dedent(lines: list[str]) -> list[str]:
    body = [line for line in lines if line.strip()]
    if not body:
        return lines
    indent = min(len(line) - len(line.lstrip()) for line in body)
    return [line[indent:] if len(line) >= indent else line for line in lines]


def fence(lines: list[str], max_lines: int, lang: str = "diff") -> list[str]:
    shown = dedent(lines)
    while shown and not shown[-1].strip():
        shown.pop()
    truncated = len(shown) - max_lines
    if truncated > 0:
        shown = shown[:max_lines] + [f"… and {truncated} more line(s); see the job log."]
    return [f"```{lang}", *shown, "```"]


def details(title: str, body: list[str]) -> list[str]:
    return ["<details><summary>" + title + "</summary>", "", *body, "", "</details>"]


def render_value(value) -> str:
    if value is None:
        return "null"
    if isinstance(value, str):
        return json.dumps(value)
    return json.dumps(value, ensure_ascii=False)


def drift_diff(change: dict) -> list[str]:
    """Terraform prints no drift section, so compare the JSON before and after ourselves."""
    before, after = change.get("before") or {}, change.get("after")
    if after is None:
        return ["- # the resource no longer exists"]
    lines: list[str] = []
    for key in sorted(set(before) | set(after)):
        old, new = before.get(key), after.get(key)
        if old == new:
            continue
        lines.append(f"- {key} = {render_value(old)}")
        lines.append(f"+ {key} = {render_value(new)}")
    return lines or ["  # no attribute difference was reported"]


def diagnostic_row(prefix: str, target_dir: str, filename: str, line: int, message: str) -> str:
    """One row per diagnostic, reading location first, with the whole row as the link."""
    if not filename:
        return f"- {message}"
    label = f"`{filename}:{line}`" if line else f"`{filename}`"
    text = f"{label} — {message}"
    if not prefix:
        return f"- {text}"
    path = filename if target_dir in ("", ".") else f"{target_dir}/{filename}"
    anchor = f"#L{line}" if line else ""
    return f"- [{text}]({prefix}{path}{anchor})"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plan-json", required=True)
    parser.add_argument("--plan-text", default="")
    parser.add_argument("--stream", default="")
    parser.add_argument("--target-dir", default=".")
    parser.add_argument("--file-url-prefix", default="")
    parser.add_argument("--max-resources", type=int, default=50)
    parser.add_argument("--diff-max-lines", type=int, default=60)
    parser.add_argument("--diff", default="true")
    parser.add_argument("--max-bytes", type=int, default=30000)
    parser.add_argument("--failed", default="false")
    parser.add_argument("--part", choices=("body", "headline"), default="body")
    args = parser.parse_args()

    show_diff = args.diff == "true"

    try:
        with open(args.plan_json, encoding="utf-8") as handle:
            plan = json.load(handle)
    except (OSError, json.JSONDecodeError):
        plan = {}

    plan_text = ""
    if args.plan_text:
        try:
            with open(args.plan_text, encoding="utf-8") as handle:
                plan_text = handle.read()
        except OSError:
            plan_text = ""

    diagnostics = []
    if args.stream:
        try:
            with open(args.stream, encoding="utf-8") as handle:
                for raw in handle:
                    try:
                        message = json.loads(raw)
                    except json.JSONDecodeError:
                        continue
                    if message.get("type") == "diagnostic":
                        diagnostics.append(message.get("diagnostic", {}))
        except OSError:
            pass

    changes = [
        change
        for change in plan.get("resource_changes", [])
        if change.get("change", {}).get("actions") not in (["no-op"], ["read"])
    ]
    counts = {"create": 0, "update": 0, "destroy": 0, "replace": 0}
    for change in changes:
        actions = change.get("change", {}).get("actions", [])
        if actions == ["create"]:
            counts["create"] += 1
        elif actions == ["update"]:
            counts["update"] += 1
        elif actions == ["delete"]:
            counts["destroy"] += 1
        elif set(actions) == {"create", "delete"}:
            counts["replace"] += 1
    drift = plan.get("resource_drift", [])

    failed = args.failed == "true"
    errors = [item for item in diagnostics if item.get("severity") == "error"]
    warnings = [item for item in diagnostics if item.get("severity") == "warning"]

    def plural(count: int, noun: str) -> str:
        return f"{count} {noun}" if count == 1 else f"{count} {noun}s"

    # The headline sits next to the target's name in the report, so it stays to a single line.
    if args.part == "headline":
        # Each group is one concern, so they are divided rather than run together.
        groups: list[str] = []
        if not failed:
            if changes:
                groups.append(" ".join(f"{COUNT_SIGNS[key]}{counts[key]}" for key in COUNT_SIGNS if counts[key]))
            else:
                groups.append("no changes")
        if drift:
            groups.append(f"🟪 {plural(len(drift), 'drifted')}")
        notices = []
        if errors:
            notices.append(f"❌ {plural(len(errors), 'error')}")
        if warnings:
            notices.append(f"⚠️ {plural(len(warnings), 'warning')}")
        if notices:
            groups.append(" ".join(notices))
        print(GROUP_DIVIDER.join(groups))
        return 0

    out: list[str] = []

    if failed:
        # The heading already carries ❌ and the error count, so there is no banner to repeat it.
        if not errors and not warnings:
            out.append("The plan failed and reported no diagnostics. See the job log.")
    elif not changes:
        out.append("No changes. The infrastructure matches the configuration.")
    else:
        out.extend([f"{HEADING} Resource changes", ""])
        sliced = slice_resources(plan_text) if show_diff else []
        by_address = {item["address"]: item for item in sliced}

        for change in changes[: args.max_resources]:
            address = change.get("address", "")
            actions = change.get("change", {}).get("actions", [])
            if set(actions) == {"create", "delete"}:
                action = "replace"
            elif actions == ["delete"]:
                action = "destroy"
            else:
                action = actions[0] if actions else "change"
            item = by_address.get(address)
            sign = item["sign"] if item else SIGNS.get(action, SIGNS["change"])
            reason = (item or {}).get("note") or change.get("action_reason", "").replace("_", " ")
            title = f"{sign} <code>{address}</code>"
            if reason:
                title += f" — {reason}"

            if item and item["lines"]:
                out.extend(details(title, fence(item["lines"], args.diff_max_lines)))
            else:
                out.append(f"- {sign} <code>{address}</code>" + (f" — {reason}" if reason else ""))
        if len(changes) > args.max_resources:
            out.extend(["", f"… and {len(changes) - args.max_resources} more resource(s); see the job log."])

    if drift:
        out.extend(["", f"{HEADING} Changed outside of Terraform", ""])
        for item in drift[: args.max_resources]:
            address = item.get("address", "")
            body = fence(drift_diff(item.get("change", {})), args.diff_max_lines) if show_diff else []
            title = f"{SIGNS['drift']} <code>{address}</code>"
            out.extend(details(title, body) if body else [f"- {title}"])
        if len(drift) > args.max_resources:
            out.extend(["", f"… and {len(drift) - args.max_resources} more; see the job log."])

    for found, heading in ((errors, "Errors"), (warnings, "Warnings")):
        if not found:
            continue
        # The count is on the workspace heading already, so the section only needs a name.
        out.extend(["", f"{HEADING} {heading}", ""])
        for item in found[: args.max_resources]:
            rng = item.get("range") or {}
            out.append(
                diagnostic_row(
                    args.file_url_prefix,
                    args.target_dir,
                    rng.get("filename", ""),
                    (rng.get("start") or {}).get("line", 0),
                    item.get("summary", ""),
                )
            )

    summary = "\n".join(out).strip()

    # The report shares a pull request comment with every other workspace, and GitHub rejects a comment
    # over 65,536 characters, so one workspace is cut off well before it can spend the whole budget.
    if args.max_bytes > 0 and len(summary) > args.max_bytes:
        cut = summary[: args.max_bytes].rsplit("\n", 1)[0]
        # Never leave a fence or a details block open, or the rest of the report renders inside it.
        if cut.count("```") % 2:
            cut += "\n```"
        cut += "\n\n</details>" * max(0, cut.count("<details>") - cut.count("</details>"))
        summary = cut + "\n\n> [!NOTE]\n> The summary was truncated. The full plan is in the job log."

    print(summary)
    return 0


if __name__ == "__main__":
    sys.exit(main())
