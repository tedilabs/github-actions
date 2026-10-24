"""Exercise the real PyGithub pagination and mutation methods with a stub transport."""
import base64
import unittest
from unittest.mock import patch
from urllib.parse import urlsplit, parse_qs, unquote

from github import Auth, Github
from github.Requester import Requester

import size_labeler as action
from test_contract import Core


class SDKTests(unittest.TestCase):
    def test_paginated_files_labels_comments_and_enterprise_api(self):
        base = "https://github.example/api/v3"
        pull_url = f"{base}/repos/tedilabs/example/pulls/42"
        issue_url = f"{base}/repos/tedilabs/example/issues/42"
        requests, writes = [], []

        def transport(requester, verb, url, parameters=None, headers=None, input=None, **kwargs):
            path = unquote(urlsplit(url).path).removeprefix("/api/v3")
            page = int((parameters or {}).get("page", parse_qs(urlsplit(url).query).get("page", [1])[0]))
            requests.append((verb, path, page))
            if path.endswith("graphql"):
                self.assertEqual(input["query"], "{ viewer { login } }")
                return {}, {"data": {"viewer": {"login": "github-actions[bot]"}}}
            if verb != "GET":
                writes.append((verb, path, input))
                return {}, {"id": 7, "body": "updated", "url": f"{base}/repos/tedilabs/example/issues/comments/7"}
            if path.endswith("/pulls/42"):
                return {}, {"number": 42, "url": pull_url, "issue_url": issue_url,
                            "head": {"sha": "head"}, "base": {"sha": "base"}, "changed_files": 101}
            if "/contents/" in path:
                self.assertEqual(parameters["ref"], "base")
                return {}, {"type": "file", "encoding": "base64", "content": base64.b64encode(b"message_if_xl: warning").decode()}
            link = {"link": f'<{url.split("?")[0]}?page=2&per_page=100>; rel="next"'} if page == 1 else {}
            if path.endswith("/files"):
                count, additions = (100, 1) if page == 1 else (1, 900)
                return link, [{"filename": f"{page}-{i}.tf", "status": "modified", "additions": additions, "deletions": 0} for i in range(count)]
            if path.endswith("/labels"):
                return link, [{"name": f"unrelated-{i}"} for i in range(100)] if page == 1 else [{"name": "size/L"}]
            if path.endswith("/comments"):
                return link, [{"user": {"login": "someone-else"}, "body": action.COMMENT_MARKER} for _ in range(100)] if page == 1 else [
                    {"id": 7, "url": f"{base}/repos/tedilabs/example/issues/comments/7", "user": {"login": "github-actions[bot]"}, "body": action.COMMENT_MARKER + "\nold"},
                ]
            self.fail(f"Unexpected request: {verb} {url}")

        core = Core()
        with Github(auth=Auth.Token("test"), base_url=base, per_page=100, lazy=True) as client:
            with patch.object(Requester, "requestJsonAndCheck", autospec=True, side_effect=transport):
                action.run(client, "tedilabs/example", {"pull_request": {"number": 42}}, {}, core)
        self.assertEqual(core.outputs["changed_files"], 101)
        self.assertEqual(core.outputs["changed_lines"], 1000)
        self.assertTrue(core.outputs["count_complete"])
        for suffix in ("files", "labels", "comments"):
            self.assertTrue(any(path.endswith('/' + suffix) and page == 2 for _, path, page in requests))
        self.assertEqual(writes, [
            ("POST", "/repos/tedilabs/example/issues/42/labels", ["size/XL"]),
            ("DELETE", "/repos/tedilabs/example/issues/42/labels/size/L", None),
            ("PATCH", "/repos/tedilabs/example/issues/comments/7", {"body": action.COMMENT_MARKER + "\nwarning"}),
        ])
