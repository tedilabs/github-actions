const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');

// Exercise the script shipped in the composite action without installing an SDK or test runner.
const action = readFileSync(join(__dirname, '../action.yaml'), 'utf8');
const script = action.match(/^      script: \|\n((?:        .*\n|\n)*)/m)?.[1];
assert.ok(script, 'The action must contain a github-script step.');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const run = new AsyncFunction('github', 'context', 'core', 'process', script);

const marker = '<!-- tedilabs/github.issue.welcome -->';
const contribution = (number, type = 'pr', login = 'alice', state = 'open') => ({
  number, user: { login }, state,
  ...(type === 'pr' ? { pull_request: {} } : {}),
});

function fixture({ type = 'pr', number = 200, history = [], comments = [] } = {}) {
  const outputs = {};
  const calls = [];
  const context = {
    eventName: type === 'pr' ? 'pull_request_target' : 'issues',
    repo: { owner: 'tedilabs', repo: 'example' },
    payload: {
      action: 'opened',
      sender: { login: 'someone-else' },
      [type === 'pr' ? 'pull_request' : 'issue']: contribution(number, type),
    },
  };
  const env = { ISSUE_MESSAGE: 'Welcome to your first issue!', PR_MESSAGE: 'Welcome to your first PR!' };
  const github = {
    rest: {
      issues: {
        listForRepo: 'listForRepo',
        listComments: 'listComments',
        async createComment(params) {
          calls.push({ method: 'createComment', params });
          const comment = { id: comments.length + 1, body: params.body, user: { type: 'Bot' } };
          comments.push(comment);
          return { data: comment };
        },
      },
    },
    async paginate(method, params) {
      assert.equal(method, 'listComments');
      calls.push({ method, params });
      return comments;
    },
  };
  github.paginate.iterator = async function* (method, params) {
    assert.equal(method, 'listForRepo');
    calls.push({ method, params });
    const items = history.filter((item) => item.user.login === params.creator);
    for (let i = 0; i < items.length; i += params.per_page) {
      yield { data: items.slice(i, i + params.per_page) };
    }
  };
  const core = { setOutput: (key, value) => { outputs[key] = value; }, info() {} };
  return { context, env, github, calls, outputs, run: () => run(github, context, core, { env }) };
}

for (const type of ['issue', 'pr']) {
  test(`welcomes the first ${type} using its author, independently of the other type`, async () => {
    const f = fixture({ type, history: [
      contribution(1, type, 'bob'),
      contribution(2, type === 'pr' ? 'issue' : 'pr'),
      contribution(200, type),
    ] });
    await f.run();
    assert.equal(f.outputs.operation, 'created');
    assert.equal(f.outputs.comment_id, 1);
    assert.deepEqual(f.calls[0].params, {
      owner: 'tedilabs', repo: 'example', creator: 'alice', state: 'all', per_page: 100,
    });
    assert.deepEqual(f.calls.at(-1).params, {
      owner: 'tedilabs', repo: 'example', issue_number: 200,
      body: `${marker}\n${type === 'pr' ? f.env.PR_MESSAGE : f.env.ISSUE_MESSAGE}`,
    });
  });

  for (const state of ['open', 'closed']) {
    test(`skips a repeated ${type} with an earlier ${state} contribution`, async () => {
      const f = fixture({ type, history: [contribution(200, type), contribution(1, type, 'alice', state)] });
      await f.run();
      assert.equal(f.outputs.operation, 'skipped');
      assert.equal(f.calls.length, 1);
    });
  }

  test(`finds an earlier ${type} beyond the first page`, async () => {
    const otherType = type === 'pr' ? 'issue' : 'pr';
    const history = Array.from({ length: 100 }, (_, i) => contribution(300 - i, otherType));
    const f = fixture({ type, history: [...history, contribution(1, type)] });
    await f.run();
    assert.equal(f.outputs.operation, 'skipped');
    assert.equal(f.calls.length, 1);
  });
}

test('later PRs do not suppress the delayed first PR, but the second PR is skipped', async () => {
  const history = [contribution(201), contribution(200)];
  const first = fixture({ history });
  const second = fixture({ number: 201, history });
  await first.run();
  await second.run();
  assert.equal(first.outputs.operation, 'created');
  assert.equal(second.outputs.operation, 'skipped');
});

test('rerunning the same event does not create another comment', async () => {
  const f = fixture();
  await f.run();
  await f.run();
  assert.equal(f.outputs.operation, 'skipped');
  assert.equal(f.outputs.comment_id, 1);
  assert.equal(f.calls.filter((call) => call.method === 'createComment').length, 1);
});

test('finds a marked comment beyond the first page, including comments made with a PAT', async () => {
  const comments = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, body: 'Discussion' }));
  comments.push({ id: 101, body: `${marker}\nAn older welcome message`, user: { type: 'User' } });
  const f = fixture({ comments });
  await f.run();
  assert.equal(f.outputs.operation, 'skipped');
  assert.equal(f.outputs.comment_id, 101);
  assert.equal(f.calls.at(-1).method, 'listComments');
});

test('passes message text as data without evaluating it', async () => {
  const f = fixture();
  f.env.PR_MESSAGE = '` ${process.exit(1)}\n"quoted" \\ text';
  await f.run();
  assert.equal(f.calls.at(-1).params.body, `${marker}\n${f.env.PR_MESSAGE}`);
});

test('skips empty messages without making API calls', async () => {
  const f = fixture();
  f.env.PR_MESSAGE = '  \n';
  await f.run();
  assert.equal(f.outputs.operation, 'skipped');
  assert.equal(f.calls.length, 0);
});

test('accepts the pull_request event as well as pull_request_target', async () => {
  const f = fixture();
  f.context.eventName = 'pull_request';
  await f.run();
  assert.equal(f.outputs.operation, 'created');
});

test('skips unsupported events and non-opened activity', async () => {
  for (const [eventName, action] of [['issue_comment', 'created'], ['push', undefined], ['pull_request_target', 'reopened'], ['pull_request_target', 'synchronize']]) {
    const f = fixture();
    f.context.eventName = eventName;
    f.context.payload.action = action;
    await f.run();
    assert.equal(f.outputs.operation, 'skipped');
    assert.equal(f.calls.length, 0);
  }
});

test('fails on history or comment lookup errors instead of posting an unverified welcome', async () => {
  for (const stage of ['history', 'comments']) {
    const f = fixture();
    if (stage === 'history') {
      f.github.paginate.iterator = async function* () { throw new Error('API unavailable'); };
    } else {
      f.github.paginate = Object.assign(async () => { throw new Error('API unavailable'); }, {
        iterator: f.github.paginate.iterator,
      });
    }
    await assert.rejects(f.run, /API unavailable/);
    assert.equal(f.calls.some((call) => call.method === 'createComment'), false);
  }
});
