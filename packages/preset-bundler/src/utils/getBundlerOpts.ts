import { CHAIN_ID } from '@kmijs/bundler-shared'
import { webpackMerge } from '@kmijs/shared'
import type {
  BasicChainUtils,
  Configuration,
  ModifyBundlerConfigUtils,
  ModifyChainUtils,
} from '@kmijs/types'
import type { IApi } from 'umi'
import { castArray } from './castArray'

export async function getBundlerOpts(opts: { api: IApi }) {
  const { api } = opts
  const chainWebpack = async (memo: any, args: BasicChainUtils) => {
    let config = await api.applyPlugins({
      key: 'chainWebpack',
      type: api.ApplyPluginsType.modify,
      initialValue: memo,
      args,
    })

    const chainUtils = getChainUtils(args)
    config = await api.applyPlugins({
      key: 'bundlerChain',
      type: api.ApplyPluginsType.modify,
      initialValue: config,
      args: chainUtils,
    })
    return config
  }

  const modifyWebpackConfig = async (memo: any, args: BasicChainUtils) => {
    let webpackConfig = await api.applyPlugins({
      key: 'modifyWebpackConfig',
      initialValue: memo,
      args,
    })

    const chainUtils = getChainUtils(args)
    const utils = getConfigUtils(webpackConfig, chainUtils)

    webpackConfig = await api.applyPlugins({
      key: 'modifyBundlerConfig',
      initialValue: webpackConfig,
      args: utils,
    })

    return webpackConfig
  }

  return {
    chainWebpack,
    modifyWebpackConfig,
  }
}

function getChainUtils(args: BasicChainUtils) {
  const { rspack, webpack, env, environment, target, isServer, isWebWorker } =
    args

  const {
    BannerPlugin,
    DefinePlugin,
    IgnorePlugin,
    ProvidePlugin,
    HotModuleReplacementPlugin,
  } = rspack || webpack

  return {
    rspack,
    webpack,
    env,
    environment,
    isDev: env === 'development',
    isProd: env === 'production',
    isServer,
    isWebWorker,
    target,
    CHAIN_ID,
    bundler: {
      BannerPlugin,
      DefinePlugin,
      IgnorePlugin,
      ProvidePlugin,
      HotModuleReplacementPlugin,
    },
  }
}

export function getConfigUtils(
  config: Configuration,
  chainUtils: ModifyChainUtils,
): ModifyBundlerConfigUtils {
  return {
    ...chainUtils,

    mergeConfig: webpackMerge,

    addRules(rules) {
      const ruleArr = castArray(rules)
      if (!config.module) {
        config.module = {}
      }
      if (!config.module.rules) {
        config.module.rules = []
      }
      config.module.rules.unshift(...ruleArr)
    },

    appendRules(rules) {
      const ruleArr = castArray(rules)
      if (!config.module) {
        config.module = {}
      }
      if (!config.module.rules) {
        config.module.rules = []
      }
      config.module.rules.push(...ruleArr)
    },

    prependPlugins(plugins) {
      const pluginArr = castArray(plugins)
      if (!config.plugins) {
        config.plugins = []
      }
      config.plugins.unshift(...pluginArr)
    },

    appendPlugins(plugins) {
      const pluginArr = castArray(plugins)
      if (!config.plugins) {
        config.plugins = []
      }
      config.plugins.push(...pluginArr)
    },

    removePlugin(pluginName) {
      if (!config.plugins) {
        return
      }
      config.plugins = config.plugins.filter((plugin) => {
        if (!plugin) {
          return true
        }
        const name = plugin.name || plugin.constructor.name
        return name !== pluginName
      })
    },
  }
}
