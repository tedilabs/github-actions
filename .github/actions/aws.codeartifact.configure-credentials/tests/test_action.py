# /// script
# requires-python = ">=3.11"
# dependencies = ["PyYAML==6.0.3"]
# ///
"""Run the actual composite shell step with an offline AWS CLI."""

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
STEP = ACTION["runs"]["steps"][0]


class ConfigureCredentialsTest(unittest.TestCase):
    def run_action(self, inputs=None, **mock):
        values = {
            "aws_region": "ap-northeast-1",
            "domain": "example",
            "domain_owner": "111122223333",
            "repository": "internal",
            "format": "pypi",
            "token_duration_seconds": ACTION["inputs"]["token_duration_seconds"]["default"],
            **(inputs or {}),
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            aws = root / "aws"
            shutil.copy(ACTION_DIR / "tests/mock-aws.py", aws)
            aws.chmod(0o755)
            environment = {**os.environ, **mock, "PATH": f"{root}:{os.environ['PATH']}"}
            for name, expression in STEP["env"].items():
                if expression.startswith("${{ inputs."):
                    environment[name] = values[expression.removeprefix("${{ inputs.").removesuffix(" }}")]
                else:
                    environment[name] = expression
            files = {name: root / name for name in ("GITHUB_ENV", "GITHUB_OUTPUT", "MOCK_AWS_CALLS")}
            for name, path in files.items():
                path.touch()
                environment[name] = str(path)
            result = subprocess.run(
                ["bash", "-c", STEP["run"]], env=environment, text=True, capture_output=True
            )
            contents = {name: path.read_text() for name, path in files.items()}
        return result, contents

    def test_formats_export_credentials_and_forward_arguments(self):
        for package_format in ("pypi", "npm", "maven"):
            for duration in ("0", "900", "43200"):
                with self.subTest(format=package_format, duration=duration):
                    result, files = self.run_action({"format": package_format, "token_duration_seconds": duration})
                    self.assertEqual(result.returncode, 0, result.stderr)
                    endpoint = f"https://example-111122223333.d.codeartifact.ap-northeast-1.amazonaws.com/{package_format}/internal/"
                    self.assertEqual(files["GITHUB_ENV"], f"CODEARTIFACT_AUTH_TOKEN=mock-codeartifact-token\nCODEARTIFACT_REPOSITORY_ENDPOINT={endpoint}\n")
                    self.assertEqual(files["GITHUB_OUTPUT"], f"repository_endpoint={endpoint}\n")
                    self.assertEqual(result.stdout, "::add-mask::mock-codeartifact-token\n")
                    self.assertEqual(result.stderr, "")
                    calls = [json.loads(line) for line in files["MOCK_AWS_CALLS"].splitlines()]
                    common = ["--region", "ap-northeast-1", "--domain", "example", "--domain-owner", "111122223333", "--output", "text", "--no-cli-pager"]
                    self.assertEqual(calls, [
                        ["codeartifact", "get-authorization-token", *common, "--duration-seconds", duration, "--query", "authorizationToken"],
                        ["codeartifact", "get-repository-endpoint", *common, "--repository", "internal", "--format", package_format, "--query", "repositoryEndpoint"],
                    ])

    def test_invalid_inputs_fail_before_aws_calls(self):
        cases = [{key: ""} for key in ACTION["inputs"]]
        cases += [{"format": "python"}]
        cases += [{"token_duration_seconds": value} for value in ("-1", "899", "43201", "0900", "1.5", "$(exit 0)", "999999999999999999999")]
        for inputs in cases:
            with self.subTest(inputs=inputs):
                result, files = self.run_action(inputs)
                self.assertNotEqual(result.returncode, 0)
                self.assertTrue(all(value == "" for value in files.values()))

    def test_api_failures_export_nothing(self):
        for operation in ("get-authorization-token", "get-repository-endpoint"):
            with self.subTest(operation=operation):
                result, files = self.run_action(MOCK_AWS_FAILURE=operation)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(files["GITHUB_ENV"], "")
                self.assertEqual(files["GITHUB_OUTPUT"], "")
                self.assertIn("Mock AWS API failure", result.stderr)
                if operation == "get-repository-endpoint":
                    self.assertEqual(result.stdout, "::add-mask::mock-codeartifact-token\n")

    def test_invalid_responses_cannot_inject_environment_variables(self):
        for key in ("MOCK_AWS_TOKEN", "MOCK_AWS_ENDPOINT"):
            for value in ("", "None", "null", "https://example/\nINJECTED=value", "https://example/\rINJECTED=value"):
                with self.subTest(key=key, value=value):
                    result, files = self.run_action(**{key: value})
                    self.assertNotEqual(result.returncode, 0)
                    self.assertEqual(files["GITHUB_ENV"], "")
                    self.assertEqual(files["GITHUB_OUTPUT"], "")
                    self.assertNotIn("INJECTED", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
