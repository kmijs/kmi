import path from 'node:path'
import { semver } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'
import { BundlerTypeEnum } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:react',
  })

  api.modifyDefaultConfig((memo) => {
    // Default enable svgr, svgo
    memo.svgr = {
      mixedImport: true,
      // Default Umi uses mixed import
      exportType: 'named',
    }
    memo.svgo = {}
    return memo
  })

  api.modifySwcLoaderOptions((memo, { env, isServer }) => {
    const isDev = env === 'development'
    const useFastRefresh =
      isDev && api.config.fastRefresh !== false && !isServer
    const isGTEReact17 = semver.gte(api.appData.react.version, '16.14.0')

    memo.jsc ||= {}
    memo.jsc.transform ||= {}
    memo.jsc.transform.react = {
      development: isDev,
      refresh: useFastRefresh,
      runtime: isGTEReact17 ? 'automatic' : 'classic',
    }

    memo.jsc.parser = {
      ...memo.jsc.parser,
      syntax: 'typescript',
      // enable supports for React JSX/TSX compilation
      tsx: true,
    }
    return memo
  })

  api.bundlerChain({
    stage: -1,
    async fn(memo, { CHAIN_ID, isServer }) {
      if (api.appData.bundler !== BundlerTypeEnum.rspack) return memo
      if (isServer) return memo

      const isDev = api.env === 'development'
      const useFastRefresh = isDev && api.config.fastRefresh !== false
      if (useFastRefresh) {
        const { default: ReactRefreshRspackPlugin } = await import(
          '@rspack/plugin-react-refresh'
        )
        const SCRIPT_REGEX = /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/
        const NODE_MODULES_REGEX = /[\\/]node_modules[\\/]/

        memo
          .plugin(CHAIN_ID.PLUGIN.REACT_FAST_REFRESH)
          .after(CHAIN_ID.PLUGIN.HMR)
          .use(ReactRefreshRspackPlugin, [
            {
              include: [SCRIPT_REGEX],
              exclude: [NODE_MODULES_REGEX],
            },
          ])
        memo.resolve.alias.set(
          'react-refresh',
          path.dirname(require.resolve('react-refresh')),
        )
        return memo
      }
      return memo
    },
  })

  api.addBabelPresets(async () => {
    if (api.appData.bundler !== BundlerTypeEnum.webpack) return []
    const isGTEReact17 = semver.gte(api.appData.react.version, '16.14.0')
    const babelPresetOpts = await api.applyPlugins({
      key: 'modifyBabelPresetOpts',
      initialValue: {
        presetEnv: {},
        presetReact: {
          runtime: isGTEReact17 ? 'automatic' : 'classic',
          ...(isGTEReact17 ? {} : { importSource: undefined }),
        },
        presetTypeScript: api.config.presetTypeScriptOpts || {},
        pluginTransformRuntime: {},
        pluginLockCoreJS: {},
        pluginDynamicImportNode: false,
        pluginAutoCSSModules: api.config.autoCSSModules,
        classPropertiesLoose: {},
      },
    })

    return [require.resolve('@kmijs/babel-preset-react'), babelPresetOpts]
  })
}
