const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { DEFAULTS, parseConfig, resolveOptions, classify, labelChanges, run } = require('../src/index.cjs');

const file = (name, additions, deletions = 0, status = 'modified') => ({ filename: name, additions, deletions, status });
const notFound = () => Object.assign(new Error('Not Found'), { status: 404 });
const options = (extra = {}) => resolveOptions(extra);

const { fixture } = require('./helpers.cjs');

test('exclusive boundaries preserve the existing XS/S/M/L/XL policy', () => {
  for (const [lines, expected] of [[0, 'xs'], [14, 'xs'], [15, 's'], [99, 's'], [100, 'm'], [499, 'm'], [500, 'l'], [999, 'l'], [1000, 'xl'], [100000, 'xl']]) {
    assert.equal(classify(lines, options()), expected, String(lines));
  }
});

test('YAML values override only provided inputs, including false and empty message', () => {
  const resolved = resolveOptions({ xs_max_size: '25', s_max_size: '200', ignore_file_deletions: 'true', message_if_xl: 'warning' },
    parseConfig('xs_max_size: 30\nignore_file_deletions: false\nmessage_if_xl: ""'));
  assert.equal(resolved.xs_max_size, 30);
  assert.equal(resolved.s_max_size, 200);
  assert.equal(resolved.ignore_file_deletions, false);
  assert.equal(resolved.message_if_xl, '');
});

test('invalid YAML, duplicate keys, unknown keys and credential overrides are rejected', () => {
  for (const text of ['[xs, s]', 'xs_max_size: [', 'xs_max_size: 1\nxs_max_size: 2', 'ignore_deleted_lines: true', 'GITHUB_TOKEN: secret', 'github_api_url: https://example.com', 'config_file: other.yaml', 'pr_number: 99']) {
    assert.throws(() => parseConfig(text), undefined, text);
  }
});

test('reject invalid thresholds, booleans and duplicate labels before API writes', () => {
  for (const invalid of [{ xs_max_size: 0 }, { xs_max_size: 100 }, { l_max_size: -1 }, { s_max_size: 1.5 }, { m_max_size: true }, { xs_label: 'size/S' }, { xs_label: '' }, { ignore_line_deletions: 'yes' }, { size_label_prefix: '' }, { message_if_xl: null }, { files_to_ignore: [1] }]) {
    assert.throws(() => resolveOptions({}, invalid));
  }
});

test('legacy quoted/whitespace-separated patterns and YAML lists are supported', () => {
  assert.deepEqual(options({ files_to_ignore: '"**/*.lock"\n\'docs/a b.md\' *.sum' }).files_to_ignore, ['**/*.lock', 'docs/a b.md', '*.sum']);
  assert.deepEqual(resolveOptions({}, parseConfig('files_to_ignore:\n- "**/*.lock"')).files_to_ignore, ['**/*.lock']);
});

test('autodiscovery reads the first available config from the PR base SHA', async () => {
  const f = fixture({ config: { '.github/size-labeler.yaml': 'xs_max_size: 5', '.github/size-labeler.yml': 'xs_max_size: 20' } });
  await f.execute();
  assert.equal(f.outputs.label, 'size/S');
  assert.equal(f.outputs.config_file, '.github/size-labeler.yaml');
  const reads = f.calls.filter((c) => c.name === 'getContent');
  assert.equal(reads.length, 1);
  assert.equal(reads[0].parameters.ref, 'trusted-base-sha');
  assert.equal(reads[0].parameters.repo, 'example');
});

test('autodiscovery falls back to size-labeler.yml and then action inputs', async () => {
  const f = fixture({ config: { '.github/size-labeler.yml': 'xs_max_size: 5' } });
  await f.execute();
  assert.equal(f.outputs.config_file, '.github/size-labeler.yml');
  assert.equal(f.outputs.label, 'size/S');
  const absent = fixture();
  await absent.execute({ xs_max_size: '5' });
  assert.equal(absent.outputs.config_file, '');
  assert.equal(absent.outputs.label, 'size/S');
});

test('explicit config path does not fall back; missing path fails before writes', async () => {
  const f = fixture({ config: { 'config/size.yaml': 'xs_max_size: 5' } });
  await f.execute({ config_file: 'config/size.yaml' });
  assert.equal(f.outputs.label, 'size/S');
  assert.deepEqual(f.calls.filter((c) => c.name === 'getContent').map((c) => c.parameters.path), ['config/size.yaml']);
  const missing = fixture();
  await assert.rejects(missing.execute({ config_file: 'missing.yaml' }), { status: 404 });
  assert.deepEqual(missing.writes(), []);
});

test('permission failures are not treated as missing config', async () => {
  const f = fixture();
  f.github.rest.repos.getContent = async () => { throw Object.assign(new Error('Forbidden'), { status: 403 }); };
  await assert.rejects(f.execute(), { status: 403 });
  assert.deepEqual(f.writes(), []);
});

test('empty configuration is valid; invalid configuration stops before writes', async () => {
  const empty = fixture({ config: { '.github/size-labeler.yml': '# no overrides' } });
  await empty.execute();
  assert.equal(empty.outputs.label, 'size/XS');
  const invalid = fixture({ config: { '.github/size-labeler.yml': 's_max_size: 2' } });
  await assert.rejects(invalid.execute(), /strictly increasing/);
  assert.deepEqual(invalid.writes(), []);
});

test('all file pages are counted, including the file that changes the size on page two', async () => {
  const f = fixture({ pages: [Array.from({ length: 100 }, (_, i) => file(`${i}.tf`, 0)), [file('last.tf', 1000)]] });
  await f.execute({ message_if_xl: '' });
  assert.equal(f.outputs.label, 'size/XL');
  assert.equal(f.outputs.changed_files, 101);
  assert.equal(f.outputs.changed_lines, 1000);
  assert.equal(f.outputs.count_complete, true);
  assert.equal(f.calls.filter((c) => c.name === 'filePage').length, 2);
});

test('removed files and deleted lines have independent switches', async () => {
  const pages = [[file('edited.tf', 10, 20), file('deleted.tf', 0, 100, 'removed')]];
  for (const [ignoreFiles, ignoreLines, lines, files] of [[true, false, 30, 1], [false, false, 130, 2], [true, true, 10, 1], [false, true, 10, 2]]) {
    const f = fixture({ pages });
    await f.execute({ ignore_file_deletions: ignoreFiles, ignore_line_deletions: ignoreLines });
    assert.equal(f.outputs.changed_lines, lines);
    assert.equal(f.outputs.changed_files, files);
  }
});

test('glob exclusions include nested files/dotfiles; renames and binaries count normally', async () => {
  const f = fixture({ pages: [[file('pkg/package.lock', 1000), file('.github/generated.json', 1000), file('docs/a b.md', 1000), file('renamed.tf', 5, 2, 'renamed'), file('image.png', 0, 0, 'added')]] });
  await f.execute({ files_to_ignore: '**/*.lock .github/** "docs/a b.md"' });
  assert.equal(f.outputs.changed_lines, 7);
  assert.equal(f.outputs.changed_files, 2);
});

test('empty PR and fully excluded PR classify as XS', async () => {
  for (const pages of [[], [[file('deleted.tf', 0, 1000, 'removed')]]]) {
    const f = fixture({ pages });
    await f.execute();
    assert.equal(f.outputs.size, 'xs');
    assert.equal(f.outputs.changed_lines, 0);
  }
});

test('API truncation reports a lower bound only if XL is certain', async () => {
  const f = fixture({ changedFiles: 3001, pages: [[file('large.tf', 1000)]] });
  await f.execute({ message_if_xl: '' });
  assert.equal(f.outputs.count_complete, false);
  assert.equal(f.outputs.size, 'xl');
  const ambiguous = fixture({ changedFiles: 3001, pages: [[file('small.tf', 999)]] });
  await assert.rejects(ambiguous.execute(), /cannot assign an accurate size/);
  assert.deepEqual(ambiguous.writes(), []);
});

test('configured labels are replaced, foreign size labels and unrelated labels are preserved', () => {
  assert.deepEqual(labelChanges(['size/L', 'size/manual', 'bug'], 'size/S', options()), { add: ['size/S'], remove: ['size/L'] });
  assert.deepEqual(labelChanges(['SIZE/s', 'size/XS'], 'size/S', options()), { add: [], remove: ['size/XS'] });
});

test('overwrite applies only to configured labels and the selected size prefix', () => {
  const configured = options({ xs_label: 'tiny', overwrite_other_size_labels: true, size_label_prefix: 'review/' });
  assert.deepEqual(labelChanges(['tiny', 'review/manual', 'size/manual', 'bug'], 'size/M', configured), {
    add: ['size/M'], remove: ['tiny', 'review/manual'],
  });
});

test('normal run adds the target before removing obsolete labels and is idempotent', async () => {
  const f = fixture({ labels: ['size/L', 'size/manual', 'bug'] });
  await f.execute();
  assert.deepEqual(f.writes().map((c) => c.name), ['addLabels', 'removeLabel']);
  assert.deepEqual(f.writes()[0].parameters.labels, ['size/XS']);
  assert.equal(f.writes()[1].parameters.name, 'size/L');
  const unchanged = fixture({ labels: ['size/XS', 'size/manual', 'bug'] });
  await unchanged.execute();
  assert.deepEqual(unchanged.writes(), []);
});

test('dry run outputs intended changes without comments, mutations or XL failure', async () => {
  const f = fixture({ pages: [[file('big.tf', 1000)]], labels: ['size/S'] });
  await f.execute({ dry_run: true, fail_if_xl: true });
  assert.equal(f.outputs.size, 'xl');
  assert.equal(f.outputs.added_labels, '["size/XL"]');
  assert.equal(f.outputs.removed_labels, '["size/S"]');
  assert.deepEqual(f.writes(), []);
  assert.deepEqual(f.failures, []);
});

test('config may override dry_run and other behavior inputs', async () => {
  const f = fixture({ config: { '.github/size-labeler.yaml': 'dry_run: true\noverwrite_other_size_labels: true' }, labels: ['size/manual'] });
  await f.execute({ dry_run: false });
  assert.equal(f.outputs.dry_run, true);
  assert.equal(f.outputs.removed_labels, '["size/manual"]');
  assert.deepEqual(f.writes(), []);
});

test('XL comments are sticky, scoped to the token author, and separate from failure policy', async () => {
  const marker = '<!-- tedilabs:github.pr.size-labeler:xl -->';
  const comments = [{ id: 1, user: { login: 'someone-else' }, body: `${marker}\nold` }];
  const f = fixture({ pages: [[file('big.tf', 1000)]], comments });
  await f.execute({ message_if_xl: 'warning', fail_if_xl: true });
  assert.equal(f.writes().at(-1).name, 'createComment');
  assert.equal(f.writes().at(-1).parameters.body, `${marker}\nwarning`);
  assert.equal(f.failures.length, 1);
  comments.push({ id: 2, user: { login: 'github-actions[bot]' }, body: `${marker}\nwarning` });
  const same = fixture({ pages: [[file('big.tf', 1000)]], comments, labels: ['size/XL'] });
  await same.execute({ message_if_xl: 'warning' });
  assert.deepEqual(same.writes(), []);
  const updated = fixture({ pages: [[file('big.tf', 1000)]], comments, labels: ['size/XL'] });
  await updated.execute({ message_if_xl: 'new warning' });
  assert.equal(updated.writes()[0].name, 'updateComment');
  assert.equal(updated.writes()[0].parameters.comment_id, 2);
});

test('empty XL message disables comments; fail_if_xl still works', async () => {
  const f = fixture({ pages: [[file('big.tf', 1000)]], labels: ['size/XL'] });
  await f.execute({ message_if_xl: '', fail_if_xl: true });
  assert.deepEqual(f.writes(), []);
  assert.equal(f.calls.some((c) => c.name === 'graphql'), false);
  assert.equal(f.failures.length, 1);
});

test('PR updates during calculation prevent stale writes', async () => {
  const f = fixture({ stale: true });
  await assert.rejects(f.execute(), /PR changed during size calculation/);
  assert.deepEqual(f.writes(), []);
});

test('pr_number supports non-PR events and rejects missing context', async () => {
  const f = fixture();
  f.context.payload = {};
  await assert.rejects(f.execute(), /pr_number/);
  await f.execute({ pr_number: '123' });
  assert.equal(f.calls.find((c) => c.name === 'getPull').parameters.pull_number, 123);
});

test('label removal tolerates only a concurrently removed label', async () => {
  const f = fixture({ labels: ['size/L'] });
  f.github.rest.issues.removeLabel = async () => { throw notFound(); };
  await f.execute();
  const forbidden = fixture({ labels: ['size/L'] });
  forbidden.github.rest.issues.removeLabel = async () => { throw Object.assign(new Error('Forbidden'), { status: 403 }); };
  await assert.rejects(forbidden.execute(), { status: 403 });
});

test('action metadata defaults match policy defaults', () => {
  const metadata = yaml.load(readFileSync(path.join(__dirname, '../action.yaml'), 'utf8'));
  const inputs = Object.fromEntries(Object.entries(metadata.inputs).map(([key, value]) => [key, value.default]));
  assert.deepEqual(resolveOptions(inputs), DEFAULTS);
});

test('the actual composite script invokes the source with environment inputs', async () => {
  const metadata = yaml.load(readFileSync(path.join(__dirname, '../action.yaml'), 'utf8'));
  const step = metadata.runs.steps.find((step) => step.id === 'label');
  assert.equal(step.uses, 'actions/github-script@v9');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const script = new AsyncFunction('require', 'process', 'github', 'context', 'core', step.with.script);
  const f = fixture({ pages: [[file('file.tf', 15)]] });
  await script(require, { env: {
    SIZE_LABELER_RUNTIME_DIR: path.resolve(__dirname, '..'),
    SIZE_LABELER_INPUTS: JSON.stringify({ dry_run: true }),
  } }, f.github, f.context, f.core);
  assert.equal(f.outputs.label, 'size/S');
  assert.deepEqual(f.writes(), []);
});
