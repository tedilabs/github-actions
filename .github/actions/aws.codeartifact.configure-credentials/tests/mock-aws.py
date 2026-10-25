#!/usr/bin/env python3
"""Offline AWS CLI fixture shared by regression and composite smoke tests."""

import json
import os
import sys

arguments = sys.argv[1:]
with open(os.environ["MOCK_AWS_CALLS"], "a") as calls:
    calls.write(json.dumps(arguments) + "\n")

operation = arguments[1]
if operation == os.environ.get("MOCK_AWS_FAILURE"):
    print("Mock AWS API failure", file=sys.stderr)
    sys.exit(1)

if operation == "get-authorization-token":
    print(os.environ.get("MOCK_AWS_TOKEN", "mock-codeartifact-token"))
elif operation == "get-repository-endpoint":
    package_format = arguments[arguments.index("--format") + 1]
    endpoint = f"https://example-111122223333.d.codeartifact.ap-northeast-1.amazonaws.com/{package_format}/internal/"
    print(os.environ.get("MOCK_AWS_ENDPOINT", endpoint))
else:
    sys.exit("Unexpected AWS operation")
