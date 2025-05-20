import { dirname } from 'node:path'
import autoCSSModules from './plugins/autoCSSModules'
import dynamicImportNode from './plugins/dynamicImportNode'
import lockCoreJS from './plugins/lockCoreJS'

interface IOpts {
  presetEnv: any
  presetReact: any
  presetTypeScript: any
  pluginTransformRuntime: any
  pluginLockCoreJS: any
  pluginDynamicImportNode: any
  pluginAutoCSSModules: any
  pluginDecorators: any
}

export default (_context: any, opts: IOpts) => ({
  presets: [
    [
      require.resolve('@kmijs/bundler-compiled/compiled/babel/preset-env'),
      {
        bugfixes: true,
        // 更兼容 spec，但会变慢，所以不开
        spec: false,
        // 推荐用 top level 的 assumptions 配置
        loose: false,
        // 保留 es modules 语法，交给 webpack 处理
        modules: false,
        debug: false,
        useBuiltIns: 'entry',
        corejs: '3',
        // 没必要，遇到了应该改 targets 配置
        forceAllTransforms: false,
        ignoreBrowserslistConfig: true,
        ...opts.presetEnv,
      },
    ],
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/preset-typescript',
      ),
      {
        // 支持vue 后缀
        allExtensions: true,
        // 支持tsx
        isTSX: true,
        allowNamespaces: true,
        allowDeclareFields: true,
        // Why false?
        // 如果为 true，babel 只删除 import type 语句，会保留其他通过 import 引入的 type
        // 这些 type 引用走到 webpack 之后，就会报错
        onlyRemoveTypeImports: false,
        optimizeConstEnums: true,
        ...opts.presetTypeScript,
      },
    ],
  ].filter(Boolean),
  plugins: [
    // TC39 Proposals
    // class-static-block
    // decorators
    opts.pluginDecorators !== false && [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-decorators',
      ),
      {
        legacy: true,
        ...opts.pluginDecorators,
      },
    ],
    // do-expressions
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-do-expressions',
      ),
    ],
    // export-default-from
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-export-default-from',
      ),
    ],
    // export-namespace-from
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-export-namespace-from',
      ),
    ],
    // function-bind
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-function-bind',
      ),
    ],
    // function-sent
    // partial-application
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-partial-application',
      ),
    ],
    // pipeline-operator
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-pipeline-operator',
      ),
      { proposal: 'minimal' },
    ],
    // throw-expressions
    // record-and-tuple
    [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-proposal-record-and-tuple',
      ),
      {
        syntaxType: 'hash',
        importPolyfill: true,
        polyfillModuleName: dirname(
          require.resolve('@bloomberg/record-tuple-polyfill/package'),
        ),
      },
    ],
    opts.pluginTransformRuntime && [
      require.resolve(
        '@kmijs/bundler-compiled/compiled/babel/plugin-transform-runtime',
      ),
      {
        helpers: true,
        regenerator: true,
        // 7.13 之后根据 exports 自动选择 esm 和 cjs，无需此配置
        useESModules: false,
        // lock the version of @babel/runtime
        // make sure we are using the correct version
        // ref: https://github.com/babel/babel/blob/v7.16.12/packages/babel-plugin-transform-runtime/src/get-runtime-path/index.ts#L19
        // ref: https://github.com/umijs/umi/pull/7816
        absoluteRuntime: dirname(require.resolve('../package.json')),
        version: `^${require('@babel/runtime/package.json').version}`,
        ...opts.pluginTransformRuntime,
      },
    ],
    // none official plugins
    opts.pluginLockCoreJS && [lockCoreJS],
    opts.pluginDynamicImportNode && [dynamicImportNode],
    opts.pluginAutoCSSModules && [autoCSSModules],
  ].filter(Boolean),
})
