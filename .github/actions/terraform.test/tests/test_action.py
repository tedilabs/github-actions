import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET

import yaml


ACTION_DIR = Path(__file__).resolve().parents[1]
ACTION = yaml.safe_load((ACTION_DIR / "action.yaml").read_text())
STEPS = {step["id"]: step for step in ACTION["runs"]["steps"]}
SHELL_RUN = yaml.safe_load(
  (ACTION_DIR.parent / "shell.run/action.yaml").read_text()
)["runs"]["steps"][0]["run"]
SUMMARY = yaml.safe_load(
  (ACTION_DIR.parent / "github.step-summary/action.yaml").read_text()
)["runs"]["steps"][0]["run"]
VERSION = tuple(int(part) for part in json.loads(subprocess.check_output(
  ["terraform", "version", "-json"], text=True
))["terraform_version"].split(".")[:2])


def read_outputs(path):
  outputs = {}
  lines = iter(path.read_text().splitlines())
  for line in lines:
    if "<<" in line:
      key, delimiter = line.split("<<", 1)
      value = []
      for part in lines:
        if part == delimiter:
          break
        value.append(part)
      outputs[key] = "\n".join(value)
    else:
      key, value = line.split("=", 1)
      outputs[key] = value
  return outputs


class TerraformTestAction(unittest.TestCase):
  def setUp(self):
    temporary = tempfile.TemporaryDirectory()
    self.addCleanup(temporary.cleanup)
    self.root = Path(temporary.name)
    self.module = self.root / "module with spaces"
    self.module.mkdir()
    self.env = {key: value for key, value in os.environ.items()
                if not key.startswith("TF_")}
    self.env.update({key.upper(): str(value.get("default", ""))
                     for key, value in ACTION["inputs"].items()})
    self.env.update(TARGET_DIR="module with spaces", RUNNER_TEMP=str(self.root),
                    GITHUB_STEP_SUMMARY=str(self.root / "summary"))
    self.write("main.tf", '''
variable "message" {
  type    = string
  default = "hello world"
}
output "message" { value = var.message }
output "workspace" { value = terraform.workspace }
''')
    self.write("tests/main.tftest.hcl", '''
run "check_message" {
  command = plan
  assert {
    condition     = output.message == "hello world"
    error_message = "unexpected message"
  }
}
''')

  def write(self, name, content):
    path = self.module / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    return path

  def run_script(self, script, **env):
    output = self.root / "outputs"
    output.write_text("")
    result = subprocess.run(
      ["bash", "--noprofile", "--norc", "-eo", "pipefail", "-c", script],
      cwd=self.root, env={**self.env, "GITHUB_OUTPUT": str(output), **env},
      text=True, capture_output=True,
    )
    return result, read_outputs(output)

  def command(self, step):
    return self.run_script(SHELL_RUN, SCRIPT=STEPS[step]["with"]["run"],
                           WORKING_DIRECTORY="")

  def initialize(self):
    result, outputs = self.run_script(STEPS["target"]["run"])
    self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
    self.assertNotIn("skipped", outputs)
    self.env["TARGET_DIR"] = outputs["target_dir"]
    result, outputs = self.command("init")
    self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
    return outputs

  def annotate(self, outputs, init=False):
    return self.run_script(
      STEPS["test-annotate"]["run"],
      INIT_OUTCOME="failure" if init else "success",
      INIT_LOG=outputs["log_file"] if init else "",
      TEST_LOG="" if init else outputs["log_file"],
    )[0]

  def test_default_success_and_workspace(self):
    self.env["WORKSPACE"] = "testing"
    self.write("workspace.tftest.hcl", '''
run "check_workspace" {
  command = plan
  assert {
    condition     = output.workspace == "testing"
    error_message = "workspace not forwarded"
  }
}
''')
    self.initialize()
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertEqual(outputs["exitcode"], "0")
    self.assertIn("2 passed", outputs["stdout"])
    self.assertEqual(outputs["stderr"], "")

  def test_no_tests_skip_without_recursive_discovery(self):
    (self.module / "tests/main.tftest.hcl").unlink()
    self.write("tests/nested/ignored.tftest.hcl", 'run "ignored" {}')
    result, outputs = self.run_script(STEPS["target"]["run"])
    self.assertEqual(result.returncode, 0)
    self.assertEqual(outputs["skipped"], "true")

  def test_json_test_files_at_module_root_are_discovered(self):
    (self.module / "tests/main.tftest.hcl").unlink()
    self.write("root.tftest.json", json.dumps({
      "run": {"root": {"command": "plan", "assert": [{
        "condition": '${output.message == "hello world"}', "error_message": "bad variable"
      }]}}
    }))
    self.initialize()
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertIn("1 passed", outputs["stdout"])

  def test_invalid_options_and_missing_target_fail(self):
    for overrides in ({"FORMAT": "yaml"}, {"JUNIT_XML": "report.xml", "CLOUD_RUN": "example"},
                      {"TARGET_DIR": "missing"}):
      with self.subTest(overrides=overrides):
        result, outputs = self.run_script(STEPS["target"]["run"], **overrides)
        self.assertEqual(result.returncode, 1)
        self.assertIn("::error::", result.stdout)
        self.assertNotIn("skipped", outputs)

  def test_custom_directory_initializes_test_modules(self):
    self.env["TEST_DIRECTORY"] = "integration tests"
    self.write("helper/main.tf", 'output "value" { value = "installed" }')
    self.write("integration tests/module.tftest.hcl", '''
run "helper" {
  command = plan
  module { source = "./helper" }
  assert {
    condition     = output.value == "installed"
    error_message = "test module not initialized"
  }
}
''')
    self.initialize()
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertIn("1 passed", outputs["stdout"])
    self.assertNotIn("check_message", outputs["stdout"])

  def test_filters_and_variable_precedence_preserve_spaces(self):
    self.write("fixtures/first vars.tfvars", 'message = "first"')
    self.write("fixtures/second vars.tfvars", 'message = "second"')
    self.write("tests/not selected.tftest.hcl", '''
run "should_not_run" {
  assert {
    condition     = output.message == "never"
    error_message = "filter not applied"
  }
}
''')
    self.write("tests/also selected.tftest.json", json.dumps({
      "run": {"second": {"command": "plan", "assert": [{
        "condition": '${output.message == "hello world"}', "error_message": "bad variable"
      }]}}
    }))
    self.env.update(FILTERS="tests/main.tftest.hcl\n\ntests/also selected.tftest.json",
                    VAR_FILES="fixtures/first vars.tfvars\nfixtures/second vars.tfvars\n",
                    VARS="message=hello world")
    self.initialize()
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 0, result.stderr)
    self.assertIn("2 passed", outputs["stdout"])
    self.assertNotIn("should_not_run", outputs["stdout"])

  def test_failure_outputs_annotations_and_summary(self):
    self.env["VARS"] = "message=wrong"
    self.initialize()
    for format_ in ("text", "json"):
      with self.subTest(format=format_):
        self.env["FORMAT"] = format_
        result, outputs = self.command("test")
        self.assertEqual(result.returncode, 1)
        self.assertEqual(outputs["exitcode"], "1")
        log = Path(outputs["log_file"]).read_text()
        self.assertIn("unexpected message", log)
        annotation = self.annotate(outputs)
        self.assertEqual(annotation.returncode, 0, annotation.stderr)
        self.assertIn("::error file=module with spaces/tests/main.tftest.hcl,line=", annotation.stdout)
        result, _ = self.run_script(SUMMARY, TITLE="terraform test failed", FILE=outputs["log_file"],
                                     LANG_=format_, MAX_LINES="200")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("unexpected message", (self.root / "summary").read_text())

  def test_init_failure_annotated_as_text_even_in_json_mode(self):
    self.env["FORMAT"] = "json"
    self.write("broken.tf", 'variable "broken" {')
    result, outputs = self.command("init")
    self.assertEqual(result.returncode, 1)
    self.assertEqual(outputs["exitcode"], "1")
    annotation = self.annotate(outputs, init=True)
    self.assertEqual(annotation.returncode, 0, annotation.stderr)
    self.assertIn("file=module with spaces/broken.tf,line=1", annotation.stdout)
    self.assertIn("terraform init", annotation.stdout)

  def test_json_success_and_verbose(self):
    self.env.update(FORMAT="json", VERBOSE="true")
    self.initialize()
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 0, result.stderr)
    messages = [json.loads(line) for line in outputs["stdout"].splitlines()]
    self.assertTrue(any(message["type"] == "test_summary" for message in messages))
    self.assertTrue(any(message["type"] == "test_plan" for message in messages))

  @unittest.skipUnless(VERSION >= (1, 12), "parallelism and test-only init require Terraform 1.12+")
  def test_junit_parallelism_and_test_only_configuration(self):
    (self.module / "main.tf").unlink()
    self.write("helper/main.tf", 'output "value" { value = "hello world" }')
    self.write("tests/main.tftest.hcl", '''
run "test_only" {
  command = plan
  module { source = "./helper" }
  assert {
    condition     = output.value == "hello world"
    error_message = "wrong output"
  }
}
''')
    self.env.update(PARALLELISM="2", JUNIT_XML="test results.xml")
    self.initialize()
    result, _ = self.command("test")
    self.assertEqual(result.returncode, 0, result.stderr)
    report = ET.parse(self.module / "test results.xml")
    self.assertEqual(report.find("testsuite").get("tests"), "1")

  @unittest.skipUnless(VERSION >= (1, 11), "JUnit requires Terraform 1.11+")
  def test_junit_report_is_written_on_failure(self):
    self.env.update(JUNIT_XML="failure.xml", VARS="message=wrong")
    self.initialize()
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 1)
    self.assertEqual(outputs["exitcode"], "1")
    report = ET.parse(self.module / "failure.xml")
    self.assertEqual(report.find("testsuite").get("failures"), "1")

  def test_remote_arguments_are_literal_and_tests_are_not_repeated(self):
    # A stub records calls without contacting HCP Terraform or creating infrastructure.
    bin_dir = self.root / "bin"
    bin_dir.mkdir()
    stub = bin_dir / "terraform"
    stub.write_text('#!/bin/bash\nprintf "%s\\0" "$@" >> "$RUNNER_TEMP/argv"\n'
                    'echo "Error: Remote test failed" >&2\nexit 1\n')
    stub.chmod(0o755)
    self.env.update(PATH=f"{bin_dir}:{self.env['PATH']}", CLOUD_RUN="app.terraform.io/org/module/aws",
                    VARS='message=$(touch unexpected)\nlabels={ owner = "platform team" }',
                    FILTERS="tests/main.tftest.hcl\ntests/second file.tftest.hcl")
    result, outputs = self.command("test")
    self.assertEqual(result.returncode, 1)
    args = (self.root / "argv").read_bytes().decode().split("\0")[:-1]
    self.assertIn("-cloud-run=app.terraform.io/org/module/aws", args)
    self.assertIn("-var=message=$(touch unexpected)", args)
    self.assertIn('-var=labels={ owner = "platform team" }', args)
    self.assertIn("-filter=tests/second file.tftest.hcl", args)
    self.assertFalse((self.root / "unexpected").exists())
    self.assertEqual(args.count("test"), 1)
    for format_ in ("text", "json"):
      self.env["FORMAT"] = format_
      annotation = self.annotate(outputs)
      self.assertEqual(annotation.returncode, 0, annotation.stderr)
      self.assertIn("::error title=terraform test", annotation.stdout)
    self.assertEqual((self.root / "argv").read_bytes().decode().split("\0")[:-1], args)


if __name__ == "__main__":
  unittest.main()
