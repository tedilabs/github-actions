import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace as Object
from unittest.mock import patch

from github import GithubException
from ruamel.yaml import YAML

import size_labeler as action

ROOT = Path(__file__).resolve().parents[1]


class Core:
    def __init__(self):
        self.outputs, self.failures = {}, []

    def info(self, message):
        pass

    warning = info

    def output(self, name, value):
        self.outputs[name] = value

    def fail(self, message):
        self.failures.append(message)


class Fixture:
    def __init__(self, values):
        self.values, self.writes, self.reads = values, [], []
        self.core = Core()
        self.files = [Object(**f) for page in values.get("pages", [[dict(filename="main.tf", additions=10, deletions=0, status="modified")]]) for f in page]
        self.repository = Object(get_contents=self.get_contents, get_pull=self.get_pull)
        self.client = Object(get_repo=lambda name: self.repository, requester=Object(graphql_query=lambda *args: ({}, {"data": {"viewer": {"login": "github-actions[bot]"}}})))
        self.pull_reads = 0

    def get_contents(self, path, ref):
        self.reads.append((path, ref))
        config = self.values.get("config", {})
        if path not in config:
            raise GithubException(404, "Not Found")
        return Object(type="file", encoding="base64", decoded_content=config[path].encode())

    def get_pull(self, number):
        self.pull_reads += 1
        return Object(
            number=number, head=Object(sha="new-head" if self.pull_reads > 1 and self.values.get("stale") else "head-sha"),
            base=Object(sha="trusted-base-sha"), changed_files=self.values.get("changedFiles", len(self.files)),
            get_files=lambda: iter(self.files),
            get_labels=lambda: (Object(name=n) for n in self.values.get("labels", [])),
            add_to_labels=lambda *names: self.writes.append(dict(method="addLabels", labels=list(names))),
            remove_from_labels=lambda name: self.writes.append(dict(method="removeLabel", name=name)),
            get_issue_comments=self.get_comments,
            create_issue_comment=lambda body: self.writes.append(dict(method="createComment", body=body)),
        )

    def get_comments(self):
        for comment in self.values.get("comments", []):
            yield Object(
                user=Object(**comment["user"]) if comment["user"] else None, body=comment["body"],
                edit=lambda body, id=comment["id"]: self.writes.append(dict(method="updateComment", comment_id=id, body=body)),
            )

    def execute(self, inputs):
        action.run(self.client, "tedilabs/example", {"pull_request": {"number": 42}}, inputs, self.core)


class ContractTests(unittest.TestCase):
    pass


def contract_test(scenario):
    def test(self):
        fixture = Fixture(scenario["fixture"])
        inputs = {"message_if_xl": "", **scenario["inputs"]}
        if scenario.get("error"):
            with self.assertRaises(Exception):
                fixture.execute(inputs)
            self.assertEqual(fixture.writes, [])
            return
        fixture.execute(inputs)
        for key, expected in scenario.get("outputs", {}).items():
            self.assertEqual(fixture.core.outputs[key], expected, key)
        if "writes" in scenario:
            self.assertEqual(fixture.writes, scenario["writes"])
        self.assertEqual(len(fixture.core.failures), int(scenario.get("failure", False)))
        self.assertTrue(all(ref == "trusted-base-sha" for _, ref in fixture.reads))
    return test


for index, scenario in enumerate(json.loads((ROOT / "tests/contract.json").read_text())):
    setattr(ContractTests, f"test_{index:02}_{scenario['name']}", contract_test(scenario))


class RuntimeTests(unittest.TestCase):
    def test_metadata_defaults_match(self):
        metadata = YAML(typ="safe").load((ROOT / "action.yaml").read_text())
        inputs = {key: value.get("default", "") for key, value in metadata["inputs"].items()}
        self.assertEqual(action.resolve_options(inputs, {}), action.DEFAULTS)

    def test_config_schema_does_not_convert_dates(self):
        self.assertEqual(action.parse_config("message_if_xl: 2026-10-24"), {"message_if_xl": "2026-10-24"})
        with self.assertRaises(ValueError):
            action.parse_config("<<: {dry_run: true}")

    def test_invalid_policy_types(self):
        for invalid in [{"xs_max_size": True}, {"xs_max_size": -1}, {"xs_max_size": 1.5}, {"dry_run": 1}, {"message_if_xl": None}, {"size_label_prefix": ""}, {"files_to_ignore": [1]}]:
            with self.subTest(invalid=invalid), self.assertRaises(ValueError):
                action.resolve_options({}, invalid)

    def test_actions_multiline_outputs_and_error_annotations(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "output"
            with patch.dict("os.environ", {"GITHUB_OUTPUT": str(output)}):
                core = action.Actions()
                core.output("label", "first\nsecond")
                core.output("count_complete", True)
                lines = output.read_text().splitlines()
                self.assertEqual(lines[0].split("<<")[1], lines[3])
                self.assertEqual(lines[1:3], ["first", "second"])
                self.assertEqual(lines[5], "true")
                with patch("builtins.print") as logged:
                    core.fail("bad\n::warning::injected")
                    self.assertTrue(core.failed)
                    logged.assert_called_once_with("::error::bad%0A::warning::injected")

    def test_explicit_pr_number_without_event(self):
        fixture = Fixture({})
        action.run(fixture.client, "tedilabs/example", {}, {"pr_number": "123", "dry_run": True}, fixture.core)
        self.assertEqual(fixture.core.outputs["size"], "xs")
        with self.assertRaises(ValueError):
            action.run(fixture.client, "tedilabs/example", {}, {}, fixture.core)

    def test_permission_error_is_not_missing_config(self):
        fixture = Fixture({})
        fixture.repository.get_contents = lambda *a, **kw: (_ for _ in ()).throw(GithubException(403, "Forbidden"))
        with self.assertRaises(GithubException):
            fixture.execute({})
        self.assertEqual(fixture.writes, [])

    def test_removal_ignores_only_not_found(self):
        for status in (404, 403):
            fixture = Fixture({"labels": ["size/L"]})
            original = fixture.repository.get_pull

            def get_pull(number):
                pull = original(number)
                pull.remove_from_labels = lambda name: (_ for _ in ()).throw(GithubException(status, "error"))
                return pull

            fixture.repository.get_pull = get_pull
            if status == 404:
                fixture.execute({})
            else:
                with self.assertRaises(GithubException):
                    fixture.execute({})
