import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const entry = path.resolve(
  repoRoot,
  'packages/bundler-shared/compiled/rspack-chain/src/index.js',
);
const outfile = entry;

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  allowOverwrite: true,
  platform: 'node',
  format: 'cjs',
  target: ['node14'],
  sourcemap: false,
  minify: false,
  charset: 'utf8',
  logLevel: 'info',
  mainFields: ['module', 'main'],
});

