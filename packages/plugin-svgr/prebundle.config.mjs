// @ts-check
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// `schema-utils` 包的体积较大，validate 校验会带来数十毫秒的性能开销。
// 因此我们跳过校验，改用 TypeScript 来保证类型安全。
const writeEmptySchemaUtils = (task) => {
  const schemaUtilsPath = join(task.distPath, 'schema-utils.js');
  writeFileSync(schemaUtilsPath, 'module.exports.validate = () => {};');
};

/** @type {import('prebundle').Config} */
export default {
  prettier: true,
  externals: {
    '@babel/core': '@kmijs/bundler-compiled/compiled/babel/core',
    '@babel/types': '@kmijs/bundler-compiled/compiled/babel/types',
    'schema-utils': '@kmijs/bundler-compiled/compiled/schema-utils',
    'loader-utils': 'loader-utils'
  },
  dependencies: [
    {
      name: 'svgo-loader',
      ignoreDts: true,
      externals: {
        'schema-utils': './schema-utils',
        'loader-utils': 'loader-utils',
      },
      afterBundle: writeEmptySchemaUtils,
    },
    {
      name: 'file-loader',
      ignoreDts: true,
      afterBundle: writeEmptySchemaUtils,
    },
    {
      name: 'url-loader',
      ignoreDts: true,
      afterBundle(task) {
        writeEmptySchemaUtils(task);

        const filePath = join(task.distPath, 'index.js');
        const content = readFileSync(filePath, 'utf-8');
        const newContent = content.replace(
          /['"]file-loader['"]/,
          'require.resolve("../file-loader")',
        );

        if (newContent !== content) {
          writeFileSync(filePath, newContent);
        }
      },
    },
    {
      name: 'cosmiconfig',
      ignoreDts: false,
    },
    {
      name: '@svgr/babel-preset',
      ignoreDts: true,
    },
    {
      name: '@svgr/core',
      externals: {
        '@svgr/babel-preset': '../babel-preset',
        'cosmiconfig': '../../cosmiconfig'
      },
    },
    {
      name: '@svgr/plugin-jsx',
      ignoreDts: true,
      externals: {
        '@svgr/babel-preset': '../babel-preset'
      },
    },
    {
      name: '@svgr/plugin-svgo',
      ignoreDts: true,
      externals: {
        'cosmiconfig': '../../cosmiconfig',
        'deepmerge': '@kmi/shared/compiled/deepmerge',
        '@svgr/babel-preset': '../babel-preset',
        commander: 'commander',
        picocolors: '@kmi/shared/compiled/picocolors'
      },
    },
  ],
};
