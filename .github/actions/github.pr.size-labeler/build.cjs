const { buildSync } = require('esbuild');
const { readFileSync, writeFileSync } = require('node:fs');
const path = require('node:path');

buildSync({
  entryPoints: [path.join(__dirname, 'src/index.cjs')],
  outfile: path.join(__dirname, 'dist/index.cjs'),
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'cjs',
  legalComments: 'inline',
});

const licenses = ['js-yaml', 'picomatch'].map((name) => {
  const directory = path.dirname(require.resolve(`${name}/package.json`));
  return `${name}\n${readFileSync(path.join(directory, 'LICENSE'), 'utf8')}`;
});
writeFileSync(path.join(__dirname, 'dist/LICENSES.txt'), licenses.join('\n\n'));
