const yaml = require('js-yaml');
const { minimatch } = require('minimatch');

const SIZES = ['xs', 's', 'm', 'l', 'xl'];
const DEFAULTS = {
  xs_label: 'size/XS', xs_max_size: 15,
  s_label: 'size/S', s_max_size: 100,
  m_label: 'size/M', m_max_size: 500,
  l_label: 'size/L', l_max_size: 1000,
  xl_label: 'size/XL',
  files_to_ignore: [],
  ignore_file_deletions: true,
  ignore_line_deletions: false,
  overwrite_size_labels: true,
  fail_if_xl: false,
  message_if_xl: 'This PR has too many changes. Please make sure you are NOT addressing multiple issues with one PR.',
  dry_run: false,
};
const DEFAULT_PATHS = ['.github/size-labeler.yaml', '.github/size-labeler.yml'];
const COMMENT_MARKER = '<!-- tedilabs:github.pr.size-labeler:xl -->';

function parseConfig(text) {
  const documents = yaml.loadAll(text, { schema: yaml.JSON_SCHEMA });
  if (documents.length > 1) throw new Error('Size labeler configuration must contain only one YAML document.');
  const config = documents.length ? documents[0] : {};
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('Size labeler configuration must be a YAML mapping.');
  }
  const overrides = {};
  for (const [key, value] of Object.entries(config)) {
    if (key === 'sizes') {
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('sizes must be a YAML mapping.');
      }
      for (const [size, settings] of Object.entries(value)) {
        if (!SIZES.includes(size)) throw new Error(`Unknown configuration key: sizes.${size}`);
        if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) {
          throw new Error(`sizes.${size} must be a YAML mapping.`);
        }
        for (const [field, setting] of Object.entries(settings)) {
          if (field !== 'label' && !(field === 'max_size' && size !== 'xl')) {
            throw new Error(`Unknown configuration key: sizes.${size}.${field}`);
          }
          overrides[`${size}_${field}`] = setting;
        }
      }
    } else {
      if (!Object.hasOwn(DEFAULTS, key) || SIZES.some((size) => key.startsWith(`${size}_`))) {
        throw new Error(`Unknown configuration key: ${key}`);
      }
      overrides[key] = value;
    }
  }
  return overrides;
}

function resolveOptions(inputs = {}, config = {}) {
  const options = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    // Empty action inputs use defaults, except intentionally empty messages/patterns.
    if (inputs[key] !== undefined && (inputs[key] !== '' || ['message_if_xl', 'files_to_ignore'].includes(key))) {
      options[key] = inputs[key];
    }
  }
  Object.assign(options, config);
  for (const [key, value] of Object.entries(DEFAULTS)) {
    if (typeof value === 'boolean') {
      if (![true, false, 'true', 'false'].includes(options[key])) {
        throw new Error(`${key} must be true or false.`);
      }
      options[key] = options[key] === true || options[key] === 'true';
    }
  }
  let previous = 0;
  const names = [];
  for (const size of SIZES) {
    const label = options[`${size}_label`];
    if (typeof label !== 'string' || !label.trim() || label.length > 50) {
      throw new Error(`${size}_label must be a nonempty label of at most 50 characters.`);
    }
    names.push(label.toLowerCase());
    if (size === 'xl') continue;
    const key = `${size}_max_size`;
    const raw = options[key];
    const limit = typeof raw === 'number' || (typeof raw === 'string' && /^\d+$/.test(raw)) ? Number(raw) : NaN;
    if (!Number.isSafeInteger(limit) || limit <= previous) {
      throw new Error('Size thresholds must be positive, strictly increasing integers.');
    }
    options[key] = limit;
    previous = limit;
  }
  if (new Set(names).size !== names.length) throw new Error('Size labels must be distinct (case-insensitive).');
  if (typeof options.message_if_xl !== 'string') throw new Error('message_if_xl must be a string.');
  if (typeof options.files_to_ignore === 'string') {
    // Retain the legacy whitespace-separated input, including quoted patterns.
    options.files_to_ignore = (options.files_to_ignore.match(/"[^"]*"|'[^']*'|\S+/g) ?? [])
      .map((pattern) => pattern.replace(/^(["'])(.*)\1$/, '$2'));
  }
  if (!Array.isArray(options.files_to_ignore) || options.files_to_ignore.some((p) => typeof p !== 'string' || !p)) {
    throw new Error('files_to_ignore must be a string or a YAML list of nonempty glob patterns.');
  }
  return options;
}

async function loadConfig(github, repository, ref, explicitPath) {
  for (const path of explicitPath ? [explicitPath] : DEFAULT_PATHS) {
    let response;
    try {
      response = await github.rest.repos.getContent({ ...repository, ref, path });
    } catch (error) {
      if (error.status === 404 && !explicitPath) continue;
      throw error;
    }
    const file = response.data;
    if (file.type !== 'file' || file.encoding !== 'base64') {
      throw new Error(`Configuration must be a regular UTF-8 file smaller than 1 MB: ${path}`);
    }
    return { path, config: parseConfig(Buffer.from(file.content, 'base64').toString('utf8')) };
  }
  return { path: '', config: {} };
}

function classify(lines, options) {
  return SIZES.find((size) => size === 'xl' || lines < options[`${size}_max_size`]);
}

async function calculateSize(github, parameters, changedFiles, options) {
  const ignored = (name) => options.files_to_ignore.some((pattern) => {
    let negate = false;
    while (pattern.startsWith('!') && !pattern.startsWith('!(')) {
      negate = !negate;
      pattern = pattern.slice(1);
    }
    return minimatch(name, pattern, { dot: true, nonegate: true, nocomment: true }) !== negate;
  });
  let lines = 0;
  let files = 0;
  let seen = 0;
  for await (const page of github.paginate.iterator(github.rest.pulls.listFiles, { ...parameters, per_page: 100 })) {
    for (const file of page.data) {
      seen++;
      if ((options.ignore_file_deletions && file.status === 'removed') || ignored(file.filename)) continue;
      files++;
      lines += file.additions + (options.ignore_line_deletions ? 0 : file.deletions);
    }
  }
  const complete = seen === changedFiles;
  // The API returns at most 3,000 files. A lower bound is enough only when XL is certain.
  if (!complete && lines < options.l_max_size) {
    throw new Error(`Only ${seen} of ${changedFiles} changed files were returned; cannot assign an accurate size label.`);
  }
  return { lines, files, complete };
}

function labelChanges(existing, desired, options) {
  const managed = new Set(SIZES.map((size) => options[`${size}_label`].toLowerCase()));
  if (!options.overwrite_size_labels && existing.some((name) => managed.has(name.toLowerCase()))) {
    return { add: [], remove: [] };
  }
  return {
    add: existing.some((name) => name.toLowerCase() === desired.toLowerCase()) ? [] : [desired],
    remove: existing.filter((name) => name.toLowerCase() !== desired.toLowerCase()
      && managed.has(name.toLowerCase())),
  };
}

async function updateComment(github, parameters, message) {
  const body = `${COMMENT_MARKER}\n${message}`;
  // Identify this token's author so a user-provided marker cannot select someone else's comment.
  const { viewer } = await github.graphql('{ viewer { login } }');
  const comments = await github.paginate(github.rest.issues.listComments, { ...parameters, per_page: 100 });
  const existing = comments.find((comment) => comment.user?.login === viewer.login && comment.body?.startsWith(COMMENT_MARKER));
  if (!existing) {
    await github.rest.issues.createComment({ ...parameters, body });
  } else if (existing.body !== body) {
    await github.rest.issues.updateComment({ ...parameters, comment_id: existing.id, body });
  }
}

async function run({ github, context, core, inputs }) {
  const pull_number = Number(inputs.pr_number || context.payload.pull_request?.number);
  if (!Number.isSafeInteger(pull_number) || pull_number <= 0) {
    throw new Error('A pull request event or a positive pr_number input is required.');
  }
  const parameters = { ...context.repo, pull_number };
  const { data: pr } = await github.rest.pulls.get(parameters);
  const loaded = await loadConfig(github, context.repo, pr.base.sha, inputs.config_file);
  const options = resolveOptions(inputs, loaded.config);
  core.info(loaded.path ? `Configuration: ${loaded.path} at base ${pr.base.sha}` : 'No configuration file; using action inputs.');
  const result = await calculateSize(github, parameters, pr.changed_files, options);
  const size = classify(result.lines, options);
  const label = options[`${size}_label`];
  core.info(`${result.complete ? '' : 'At least '}${result.lines} changed lines in ${result.files} included files: ${label}`);
  if (!result.complete) core.warning('GitHub truncated the file list. Counts are lower bounds; the XL classification is certain.');
  const issue = { ...context.repo, issue_number: pull_number };
  // Do not write a label calculated for a head/base that changed during the API reads.
  const { data: latest } = await github.rest.pulls.get(parameters);
  if (latest.head.sha !== pr.head.sha || latest.base.sha !== pr.base.sha) {
    throw new Error('The PR changed during size calculation. Rerun the action for the current revision.');
  }
  const existing = await github.paginate(github.rest.issues.listLabelsOnIssue, { ...issue, per_page: 100 });
  const changes = labelChanges(existing.map((entry) => entry.name), label, options);
  const outputs = {
    size, label, changed_lines: result.lines, changed_files: result.files,
    count_complete: result.complete, config_file: loaded.path,
    added_labels: JSON.stringify(changes.add), removed_labels: JSON.stringify(changes.remove),
    dry_run: options.dry_run,
  };
  for (const [key, value] of Object.entries(outputs)) core.setOutput(key, value);
  if (options.dry_run) {
    core.info(`Dry run: ${JSON.stringify(changes)}; no labels/comments changed and no XL failure enforced.`);
    return;
  }
  if (changes.add.length) await github.rest.issues.addLabels({ ...issue, labels: changes.add });
  for (const name of changes.remove) {
    try {
      await github.rest.issues.removeLabel({ ...issue, name });
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  if (size === 'xl' && options.message_if_xl) await updateComment(github, issue, options.message_if_xl);
  if (size === 'xl' && options.fail_if_xl) core.setFailed('The PR reaches the XL size threshold.');
}

module.exports = { DEFAULTS, parseConfig, resolveOptions, loadConfig, classify, calculateSize, labelChanges, run };
