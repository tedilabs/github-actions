const assert = require('node:assert/strict');
const { test } = require('node:test');
const cases = require('./contract.json');
const { fixture } = require('./helpers.cjs');

for (const scenario of cases) {
  test(`contract: ${scenario.name}`, async () => {
    const f = fixture(scenario.fixture);
    const inputs = { message_if_xl: '', ...scenario.inputs };
    if (scenario.error) {
      await assert.rejects(f.execute(inputs));
      assert.deepEqual(f.writes(), []);
      return;
    }
    await f.execute(inputs);
    for (const [key, expected] of Object.entries(scenario.outputs ?? {})) {
      assert.deepEqual(f.outputs[key], expected, key);
    }
    const writes = f.writes().map(({ name, parameters: { owner, repo, issue_number, ...parameters } }) => ({ method: name, ...parameters }));
    if (scenario.writes) assert.deepEqual(writes, scenario.writes);
    assert.equal(f.failures.length, scenario.failure ? 1 : 0);
  });
}
