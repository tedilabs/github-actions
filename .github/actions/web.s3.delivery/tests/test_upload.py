# /// script
# requires-python = ">=3.11"
# dependencies = ["pathspec==1.1.1", "PyYAML==6.0.2"]
# ///
"""Exercise the composite upload step with an offline AWS CLI."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

import yaml


ACTION_DIR = Path(__file__).resolve().parents[1]
ACTION = yaml.safe_load((ACTION_DIR / "action.yaml").read_text())
STEP = next(step for step in ACTION["runs"]["steps"] if step.get("id") == "upload-artifacts")
FILES = {
    "assets/app.js": "app content",
    "assets/a space.css": "css content",
    "data.json": "{}",
    "docs/about.html": "about content",
    "index.html": "index content",
}
IMMUTABLE = "public, max-age=31536000, immutable"


class UploadTest(unittest.TestCase):
    def run_upload(self, inputs=None, fail_file=""):
        values = {name: spec.get("default", "") for name, spec in ACTION["inputs"].items()}
        values.update({
            "upload_rules": json.dumps([
                {"pattern": "assets/**", "cache_control": IMMUTABLE},
                {"pattern": "*.js", "cache_control": "no-store"},
                {"pattern": "*.html", "cache_control": "no-cache"},
                {"pattern": "data.json", "cache_control": "no-cache", "content_type": "application/custom+json"},
            ]),
            "delete_exclude_patterns": "assets/**",
            **(inputs or {}),
        })
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source"
            for name, content in FILES.items():
                path = source / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content)
            aws = root / "aws"
            shutil.copy(ACTION_DIR / "tests/mock-aws.py", aws)
            aws.chmod(0o755)
            calls = root / "calls.jsonl"
            calls.touch()
            env = {**os.environ, "PATH": f"{root}:{os.environ['PATH']}", "TMPDIR": str(root)}
            for name, expression in STEP["env"].items():
                if expression.startswith("${{ inputs."):
                    env[name] = values[expression.removeprefix("${{ inputs.").removesuffix(" }}")]
            env.update({
                "UPLOAD_SOURCE": str(source), "UPLOAD_DESTINATION": "s3://fixture/site/",
                "META_REPOSITORY": "example/repo", "META_AUTHOR": "release[bot]",
                "META_BRANCH": "main", "META_SHA": "abc123",
                "GITHUB_ACTION_PATH": str(ACTION_DIR), "GITHUB_OUTPUT": str(root / "output"),
                "GITHUB_STEP_SUMMARY": str(root / "summary"), "MOCK_AWS_CALLS": str(calls),
                "MOCK_FAIL_FILE": fail_file,
                "MOCK_REMOTE_KEYS": json.dumps([
                    *[f"site/{name}" for name in FILES], "site/assets/old.js", "site/old.html",
                ]),
            })
            result = subprocess.run(["bash", "-e", "-o", "pipefail", "-c", STEP["run"]],
                                    env=env, text=True, capture_output=True)
            records = [json.loads(line) for line in calls.read_text().splitlines()]
            output = (root / "output").read_text() if (root / "output").exists() else ""
        return result, records, output

    def test_default_is_sync(self):
        self.assertEqual(ACTION["inputs"]["upload_command"]["default"], "sync")
        result, records, output = self.run_upload()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(all(record["args"][:2] == ["s3", "sync"] for record in records if "files" in record))
        self.assertEqual(output, "destination=s3://fixture/site/\n")

    def test_both_commands_preserve_files_headers_sequence_and_deletion(self):
        for command in ("sync", "cp"):
            with self.subTest(command=command):
                result, records, _ = self.run_upload({"upload_command": command})
                self.assertEqual(result.returncode, 0, result.stderr)
                uploads = [record for record in records if "files" in record]
                self.assertEqual({name: content for record in uploads for name, content in record["files"].items()}, FILES)
                self.assertEqual(sum(len(record["files"]) for record in uploads), len(FILES))
                order = [name for record in uploads for name in record["files"]]
                self.assertEqual(order[-2:], ["docs/about.html", "index.html"])
                for record in uploads:
                    args = record["args"]
                    self.assertEqual(args[:2], ["s3", command])
                    self.assertEqual(args[3], "s3://fixture/site/")
                    self.assertEqual(args.count("--recursive"), 1 if command == "cp" else 0)
                    self.assertNotIn("--delete", args)
                    self.assertEqual(json.loads(args[args.index("--metadata") + 1])["github-author"], "release[bot]")
                    for name in record["files"]:
                        self.assertEqual(args[args.index("--cache-control") + 1], IMMUTABLE if name.startswith("assets/") else "no-cache")
                        expected_type = {".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
                                         ".html": "text/html; charset=utf-8", ".json": "application/custom+json"}[Path(name).suffix]
                        self.assertEqual(args[args.index("--content-type") + 1], expected_type)
                self.assertEqual(records[-2]["args"][:2], ["s3api", "list-objects-v2"])
                self.assertEqual(records[-2]["args"][-2:], ["--prefix", "site/"])
                self.assertEqual(records[-1]["args"][:2], ["s3api", "delete-objects"])
                self.assertEqual(records[-1]["payload"]["Objects"], [{"Key": "site/old.html"}])

    def test_invalid_command_fails_before_upload_or_deletion(self):
        for command in ("", "mv", "CP", "cp --recursive", "cp; echo unexpected"):
            with self.subTest(command=command):
                result, records, output = self.run_upload({"upload_command": command})
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("upload_command must be 'sync' or 'cp'", result.stderr)
                self.assertEqual(records, [])
                self.assertEqual(output, "")

    def test_failure_stops_later_phases_and_deletion(self):
        for command in ("sync", "cp"):
            for fail_file in ("assets/app.js", "docs/about.html", "index.html"):
                with self.subTest(command=command, fail_file=fail_file):
                    result, records, output = self.run_upload({"upload_command": command}, fail_file=fail_file)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn(fail_file, records[-1]["files"])
                    self.assertTrue(all("files" in record for record in records))
                    self.assertEqual(output, "")

    def test_deletion_can_be_disabled_for_both_commands(self):
        for command in ("sync", "cp"):
            with self.subTest(command=command):
                result, records, _ = self.run_upload({"upload_command": command, "delete_stale_objects": "false"})
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue(all("files" in record for record in records))


if __name__ == "__main__":
    unittest.main()
