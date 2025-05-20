// @ts-check
import fs from 'node:fs';
import { join } from 'node:path';

function replaceFileContent(filePath, replaceFn) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = replaceFn(content);
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
  }
}

/** @type {import('prebundle').Config} */
export default {
  prettier: true,
  externals: {
    "loader-utils": "loader-utils",
    '@rspack/core': '@rspack/core',
    '@rspack/lite-tapable': '@rspack/lite-tapable',
    webpack: 'webpack',
    typescript: 'typescript',
  },
  dependencies: [
    {
      name: 'style-loader',
      ignoreDts: true,
      afterBundle: (task) => {
        fs.cpSync(
          join(task.depPath, 'dist/runtime'),
          join(task.distPath, 'runtime'),
          { recursive: true },
        );
      },
    },
  ],
};
