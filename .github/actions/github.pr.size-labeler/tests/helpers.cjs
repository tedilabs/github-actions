const assert = require('node:assert/strict');
const { run } = require('../src/index.cjs');
const file = (name, additions, deletions = 0, status = 'modified') => ({ filename: name, additions, deletions, status });
const notFound = () => Object.assign(new Error('Not Found'), { status: 404 });

function fixture({ pages = [[file('main.tf', 10)]], config = {}, labels = [], comments = [], changedFiles, stale = false } = {}) {
  const calls = [];
  const outputs = {};
  const failures = [];
  let reads = 0;
  const pr = {
    head: { sha: 'head-sha' }, base: { sha: 'trusted-base-sha' },
    changed_files: changedFiles ?? pages.flat().length,
  };
  const api = (name, implementation = () => ({})) => async (parameters) => {
    calls.push({ name, parameters });
    return implementation(parameters);
  };
  const github = {
    graphql: api('graphql', () => ({ viewer: { login: 'github-actions[bot]' } })),
    rest: {
      repos: {
        getContent: api('getContent', ({ path }) => {
          if (!Object.hasOwn(config, path)) throw notFound();
          return { data: { type: 'file', encoding: 'base64', content: Buffer.from(config[path]).toString('base64') } };
        }),
      },
      pulls: {
        get: api('getPull', () => ({ data: { ...pr, head: { sha: stale && reads++ ? 'new-head' : 'head-sha' } } })),
        listFiles: Symbol('listFiles'),
      },
      issues: {
        listLabelsOnIssue: Symbol('listLabels'),
        listComments: Symbol('listComments'),
        addLabels: api('addLabels'),
        removeLabel: api('removeLabel'),
        createComment: api('createComment'),
        updateComment: api('updateComment'),
      },
    },
  };
  github.paginate = async (method, parameters) => {
    calls.push({ name: method.description, parameters });
    if (method === github.rest.issues.listLabelsOnIssue) return labels.map((name) => ({ name }));
    if (method === github.rest.issues.listComments) return comments;
    throw new Error('Unexpected pagination method');
  };
  github.paginate.iterator = async function* (method, parameters) {
    assert.equal(method, github.rest.pulls.listFiles);
    assert.equal(parameters.per_page, 100);
    for (const data of pages) {
      calls.push({ name: 'filePage', parameters });
      yield { data };
    }
  };
  const context = { repo: { owner: 'tedilabs', repo: 'example' }, payload: { pull_request: { number: 42 } } };
  const core = {
    info() {}, warning() {},
    setOutput: (name, value) => { outputs[name] = value; },
    setFailed: (message) => { failures.push(message); },
  };
  return {
    github, context, core, calls, outputs, failures,
    execute: (inputs = {}, implementation = run) => implementation({ github, context, core, inputs }),
    writes: () => calls.filter(({ name }) => ['addLabels', 'removeLabel', 'createComment', 'updateComment'].includes(name)),
  };
}

module.exports = { fixture };
