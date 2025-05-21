import type { Compiler, Configuration } from '@kmijs/bundler-rspack'
import { pathe } from '@kmijs/shared'
import { BundlerTypeEnum, type Env } from '@kmijs/types'
import type { IApi } from 'umi'
import { bundlerRspack, bundlerWebpack } from '../utils/bundler'
import { getBabelOpts } from '../utils/getBabelOpts'
import { getBundlerOpts } from '../utils/getBundlerOpts'
import { getSwcOpts } from '../utils/rspack'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:bundler',
  })

  api.modifyUniBundler((_, { bundler }) => {
    return bundler === BundlerTypeEnum.rspack ? bundlerRspack : bundlerWebpack
  })

  api.modifyUniBundlerOpts(async (memo, { bundler }) => {
    const { chainWebpack, modifyWebpackConfig } = await getBundlerOpts({
      api,
    })

    const {
      babelPreset,
      extraBabelPlugins,
      extraBabelPresets,
      beforeBabelPresets,
      beforeBabelPlugins,
    } = await getBabelOpts({
      api,
    })

    const entry = await api.applyPlugins({
      key: 'modifyEntry',
      initialValue: {
        umi: pathe.join(api.paths.absTmpPath, 'umi.ts'),
      },
    })

    memo = {
      ...memo,
      entry,
      chainWebpack,
      modifyWebpackConfig,
      babelPreset,
      extraBabelPlugins,
      extraBabelPresets,
      beforeBabelPresets,
      beforeBabelPlugins,
    }

    memo.onBeforeCreateCompiler = (opts: {
      bundlerConfigs: Configuration[]
      env: Env
    }) => {
      api.applyPlugins({
        key: 'onBeforeCreateCompiler',
        args: opts,
      })
    }

    memo.onAfterCreateCompiler = (opts: {
      compiler: Compiler
      bundlerConfigs: Configuration[]
      env: Env
    }) => {
      api.applyPlugins({
        key: 'onAfterCreateCompiler',
        args: opts,
      })
    }

    // 处理 rspack 特有配置
    if (bundler === BundlerTypeEnum.rspack) {
      const { extraSwcPlugins, modifySwcLoaderOptions } = await getSwcOpts({
        api,
      })
      memo.extraSwcPlugins = extraSwcPlugins
      memo.modifySwcLoaderOptions = modifySwcLoaderOptions
    }

    return memo
  })

  api.modifyConfig((memo) => {
    memo.mfsu = false
    return memo
  })
}
