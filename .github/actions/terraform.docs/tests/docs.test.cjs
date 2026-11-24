const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');

// Run the action's shell scripts with the real terraform-docs CLI on PATH.
const action = readFileSync(join(__dirname, '../action.yaml'), 'utf8');
const scripts = [...action.matchAll(/^    (?:  )?run: \|\n((?:      .*\n|\n)*)/gm)]
  .map((match) => match[1]);
assert.ok(scripts.length >= 2, 'The action must contain its resolve and generation scripts.');
const begin = '<!-- BEGIN_TF_DOCS -->';
const end = '<!-- END_TF_DOCS -->';

function fixture(t, { content = '# Manual documentation\n', outputFile = 'README.md', recursive = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'terraform-docs-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const target = join(root, 'example module');
  mkdirSync(target);
  writeFileSync(join(target, 'main.tf'), 'variable "name" {\n  type = string\n}\n');
  const file = join(target, outputFile);
  if (content !== null) writeFileSync(file, content);
  if (recursive) {
    const child = join(target, 'modules', 'child');
    mkdirSync(child, { recursive: true });
    writeFileSync(join(child, 'main.tf'), 'variable "child_name" {\n  type = string\n}\n');
    writeFileSync(join(child, outputFile), `${begin}\n${end}\n`);
  }

  function run({ skip = 'false', check = false } = {}) {
    const output = join(root, 'outputs');
    writeFileSync(output, '');
    const env = {
      ...process.env,
      TARGET_DIR: target, OUTPUT_FILE: outputFile, CONFIG_FILE: '',
      RECURSIVE: String(recursive), SKIP_IF_MISSING_MARKERS: skip,
      GITHUB_OUTPUT: output, CHECK: String(check), FORMATTER: 'markdown table',
      CONFIG: '', RECURSIVE_PATH: 'modules', RECURSIVE_EXCLUDE: '',
      RECURSIVE_INCLUDE_MAIN: 'true', ARGS: '',
    };
    let result = spawnSync('bash', ['--noprofile', '--norc', '-eo', 'pipefail', '-c', scripts[0]], {
      cwd: root, env, encoding: 'utf8',
    });
    const skipped = readFileSync(output, 'utf8').includes('skipped=true');
    if (result.status === 0 && !skipped) {
      result = spawnSync('bash', ['--noprofile', '--norc', '-eo', 'pipefail', '-c', scripts[1]], {
        cwd: target, env, encoding: 'utf8',
      });
    }
    return { ...result, skipped };
  }
  return { run, file, target, read: () => readFileSync(file, 'utf8') };
}

test('disabled by default: appends generated documentation to an unmarked README', (t) => {
  const f = fixture(t);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.skipped, false);
  assert.match(f.read(), /# Manual documentation/);
  assert.ok(f.read().includes(begin));
});

for (const check of [false, true]) {
  test(`skips an unmarked file without modifying it (check=${check})`, (t) => {
    const f = fixture(t, { outputFile: 'USAGE notes.md' });
    const before = f.read();
    const result = f.run({ skip: 'true', check });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.skipped, true);
    assert.equal(f.read(), before);
  });
}

test('updates a marked README and then passes the freshness check', (t) => {
  const f = fixture(t, { content: `# Introduction\n${begin}\n${end}\n# Footer\n` });
  const generated = f.run({ skip: 'true' });
  assert.equal(generated.status, 0, generated.stderr);
  assert.equal(generated.skipped, false);
  assert.match(f.read(), /input_name/);
  assert.match(f.read(), /# Footer/);
  const checked = f.run({ skip: 'true', check: true });
  assert.equal(checked.status, 0, checked.stderr);
  assert.equal(checked.skipped, false);
});

test('still fails a freshness check for outdated marked documentation', (t) => {
  const f = fixture(t, { content: `${begin}\n${end}\n` });
  const before = f.read();
  const result = f.run({ skip: 'true', check: true });
  assert.notEqual(result.status, 0);
  assert.equal(result.skipped, false);
  assert.match(result.stderr, /out of date/);
  assert.equal(f.read(), before);
});

for (const marker of [begin, end]) {
  test(`does not hide a malformed README containing only ${marker}`, (t) => {
    const f = fixture(t, { content: `# Introduction\n${marker}\n` });
    const result = f.run({ skip: 'true' });
    assert.notEqual(result.status, 0);
    assert.equal(result.skipped, false);
  });
}

test('preserves the existing missing-file skip', (t) => {
  const f = fixture(t, { content: null });
  const result = f.run({ skip: 'true' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.skipped, true);
});

test('recursive mode still processes children when the main README has no markers', (t) => {
  const f = fixture(t, { recursive: true });
  const result = f.run({ skip: 'true' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.skipped, false);
  assert.match(readFileSync(join(f.target, 'modules/child/README.md'), 'utf8'), /input_child_name/);
});
