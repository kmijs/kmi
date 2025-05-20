import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));


export default {
  dependencies: [
    'chokidar',
    'open',
    {
      name: 'prompts',
      minify: true,
      ignoreDts: true,
    },
    {
      name: 'git-url-parse',
      minify: true,
    },
    {
      name: 'zod',
      minify: true
    },
    {
      name: 'zod-validation-error',
      minify: true,
      externals: {
        zod: '../zod',
      },
    },
    {
      name: 'lowdb',
      target: 'es2020',
      dtsExternals: ['node:fs'],
      emitFiles: [{
        path: 'package.json',
        content: '{ "name": "lowdb", "version": "7.0.1", "type": "module", "module": "./index.js", "types": "./index.d.ts" }',
      }],
      beforeBundle(task) {
        task.depEntry = require.resolve('./bundles/lowdb/bundle.mjs')
        task.depPath = resolve(__dirname, './bundles/lowdb')
      },
    },
    {
      name: 'download',
      minify: true,
      ignoreDts: true,
      externals: {
        // fix DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead
        'normalize-url': '../normalize-url',
      },
    },
    {
      name: 'normalize-url',
      minify: true,
      ignoreDts: true,
    },
  ],
};
