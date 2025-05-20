import { join } from 'node:path'
import {
  BaseBundlerConfig,
  type BundlerPlugins,
  type IBaseBundlerApplyOpts,
  type IBaseBundlerConfigOpts,
} from '@kmijs/bundler-shared-config'
import webpack, { type Configuration } from '../../compiled/webpack'
import { RuntimePublicPathPlugin } from '../plugins/RuntimePublicPathPlugin'
import type { IConfig } from '../types'
import { addDependenceCssModulesDetector } from './detectCssModulesInDependence'
import { addFastRefreshPlugin } from './fastRefreshPlugin'
import { addHarmonyLinkingErrorPlugin } from './harmonyLinkingErrorPlugin'
import { addJavaScriptRules } from './javaScriptRules'
import { addProgressPlugin } from './progressPlugin'

import { importLazy } from '@kmijs/shared'
// @ts-ignore
import MiniCSSExtractPlugin from '../../compiled/mini-css-extract-plugin'
// @ts-ignore
import { WebpackManifestPlugin } from '../../compiled/webpack-manifest-plugin'

const ForkTsCheckerWebpackPlugin: typeof import('../../compiled/fork-ts-checker-webpack-plugin') =
  importLazy(require.resolve('../../compiled/fork-ts-checker-webpack-plugin'))

export interface IOpts extends IBaseBundlerConfigOpts<IConfig> {
  cache?: {
    absNodeModulesPath?: string
    buildDependencies?: string[]
    cacheDirectory?: string
  }
}
export interface IApplyOpts extends IBaseBundlerApplyOpts<IConfig> {}

export class WebpackConfig extends BaseBundlerConfig<
  IConfig,
  IApplyOpts,
  IOpts
> {
  constructor(opts: IOpts) {
    super(opts, 'webpack', webpack)
  }

  protected getPlugins(): BundlerPlugins {
    return {
      DefinePlugin: webpack.DefinePlugin,
      IgnorePlugin: webpack.IgnorePlugin,
      ProvidePlugin: webpack.ProvidePlugin,
      HotModuleReplacementPlugin: webpack.HotModuleReplacementPlugin,
      BannerPlugin: webpack.BannerPlugin,
      CopyPlugin: require('../../compiled/copy-webpack-plugin'),
      ManifestPlugin: WebpackManifestPlugin,
      TsCheckerPlugin: ForkTsCheckerWebpackPlugin,
      CssExtractPlugin: MiniCSSExtractPlugin,
      RuntimePublicPathPlugin,
    }
  }

  protected async addRules(): Promise<void> {
    await addJavaScriptRules(this.applyOpts)
  }

  protected async addPlugins(): Promise<void> {
    const { applyOpts } = this

    await addFastRefreshPlugin(applyOpts)
    // progress
    await addProgressPlugin(applyOpts)
    // purgecss
    // handle HarmonyLinkingError
    await addHarmonyLinkingErrorPlugin(applyOpts)
    // 防止由于 node modules 中的 css 模块导致的运行时错误。
    await addDependenceCssModulesDetector(applyOpts)
  }

  protected async applyAfterConfigHooks(): Promise<void> {
    const { config, opts } = this
    // cache
    if (opts.cache) {
      config.cache({
        type: 'filesystem',
        version: require('../../package.json').version,
        buildDependencies: {
          config: opts.cache.buildDependencies || [],
        },
        cacheDirectory:
          opts.cache.cacheDirectory ||
          // 使用 rootDir 是在有 APP_ROOT 时，把 cache 目录放在根目录下
          join(
            opts.rootDir || opts.cwd,
            'node_modules',
            '.cache',
            'bundler-webpack',
          ),
      })

      config.infrastructureLogging({
        level: 'error',
        ...(process.env.WEBPACK_FS_CACHE_DEBUG
          ? {
              debug: /webpack\.cache/,
            }
          : {}),
      })
    }
  }
}

export async function getConfig(opts: IOpts): Promise<Configuration> {
  const config = new WebpackConfig(opts)
  // @ts-expect-error 类型不匹配
  return config.getConfig()
}
