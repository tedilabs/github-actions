#!/usr/bin/env python3
"""Record upload and deletion effects without contacting AWS."""

import json
import os
from pathlib import Path
import sys


args = sys.argv[1:]
record = {"args": args}
if args[:2] in (["s3", "sync"], ["s3", "cp"]):
    source = Path(args[2])
    record["files"] = {
        path.relative_to(source).as_posix(): path.read_text()
        for path in source.rglob("*") if path.is_file()
    }
elif args[:2] == ["s3api", "delete-objects"]:
    record["payload"] = json.loads(Path(args[args.index("--delete") + 1].removeprefix("file://")).read_text())
elif args[:2] != ["s3api", "list-objects-v2"]:
    sys.exit("Unexpected AWS command")

with open(os.environ["MOCK_AWS_CALLS"], "a") as log:
    log.write(json.dumps(record) + "\n")

if os.environ.get("MOCK_FAIL_FILE") in record.get("files", {}):
    sys.exit(1)
if args[:2] == ["s3api", "list-objects-v2"]:
    print(os.environ["MOCK_REMOTE_KEYS"])
