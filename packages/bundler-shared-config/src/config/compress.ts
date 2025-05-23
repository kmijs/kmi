import {
  DEFAULT_CSS_MINIFIER,
  DEFAULT_JS_MINIFIER,
} from '@kmijs/bundler-compiled'
import { CSSMinifier, JSMinifier } from '@kmijs/bundler-compiled'
// @ts-ignore
import CSSMinimizerWebpackPlugin from '@kmijs/bundler-compiled/compiled/css-minimizer-webpack-plugin'
// @ts-expect-error 无类型
import TerserPlugin from '@kmijs/bundler-compiled/compiled/terser-webpack-plugin'
import { CHAIN_ID } from '@kmijs/bundler-shared'
import { rspack } from '@kmijs/bundler-shared/rspack'
import { logger } from '@kmijs/shared'
import { EsbuildMinifyFix } from '../plugins/EsbuildMinifyFix'
import { Env, type SharedConfigOptions } from '../types'
import { getEsBuildTarget } from '../utils/getEsBuildTarget'

export function applyCompress(opts: SharedConfigOptions) {
  const { config, userConfig, env, bundlerType } = opts

  // webpack 默认使用 esbuild, rspack 默认使用 swc
  const jsMinifier =
    userConfig.jsMinifier ??
    (bundlerType === 'webpack' ? JSMinifier.esbuild : DEFAULT_JS_MINIFIER)

  // webpack 默认使用 esbuild, rspack 默认使用 lightningcss
  const cssMinifier =
    userConfig.cssMinifier ??
    (bundlerType === 'webpack' ? CSSMinifier.esbuild : DEFAULT_CSS_MINIFIER)

  if (
    env === Env.development ||
    process.env.COMPRESS === 'none' ||
    (jsMinifier === JSMinifier.none && cssMinifier === CSSMinifier.none)
  ) {
    config.optimization.minimize(false)
    return
  }

  config.optimization.minimize(true)

  // esbuild transform only allow `string[]` as target
  const esbuildTarget = getEsBuildTarget({
    targets: userConfig.targets || {},
    jsMinifier,
  })
  // 提升 esbuild 压缩产物的兼容性，比如不出现 ?? 这种语法
  if (!esbuildTarget.includes('es2015')) {
    esbuildTarget.push('es2015')
  }

  if (jsMinifier !== JSMinifier.none) {
    const jsMinifierConfigs = {
      [JSMinifier.swc]: {
        name: `${CHAIN_ID.MINIMIZER.JS}-${JSMinifier.swc}`,
        plugin:
          bundlerType === 'rspack'
            ? rspack.SwcJsMinimizerRspackPlugin
            : TerserPlugin,
        options: {
          ...(bundlerType === 'webpack'
            ? {
                extractComments: false,
                minify: TerserPlugin.swcMinify,
                terserOptions: {
                  ...userConfig.jsMinifierOptions,
                },
              }
            : userConfig.jsMinifierOptions),
        },
      },
      [JSMinifier.esbuild]: {
        name: `${CHAIN_ID.MINIMIZER.JS}-${JSMinifier.esbuild}`,
        plugin: TerserPlugin,
        options: {
          minify: TerserPlugin.esbuildMinify,
          terserOptions: {
            target: esbuildTarget,
            // remove all comments
            legalComments: 'none',
            ...userConfig.jsMinifierOptions,
          },
        },
      },
      [JSMinifier.terser]: {
        name: `${CHAIN_ID.MINIMIZER.JS}-${JSMinifier.terser}`,
        plugin: TerserPlugin,
        options: {
          minify: TerserPlugin.terserMinify,
          terserOptions: {
            format: {
              comments: false,
            },
            ...userConfig.jsMinifierOptions,
          },
        },
      },
    }

    const jsMinifierConfig = jsMinifierConfigs[jsMinifier]
    if (!jsMinifierConfig) {
      throw new Error(`不支持的 JS 压缩器 ${jsMinifier}。`)
    }

    // 处理 esbuild 特殊情况
    if (jsMinifier === JSMinifier.esbuild && userConfig.esbuildMinifyIIFE) {
      config.plugin(CHAIN_ID.PLUGIN.ESBUILD_MINIFY_FIX).use(EsbuildMinifyFix)
    }

    logger.verbose(`使用 ${jsMinifierConfig.name} 压缩 JS。`)
    config.optimization
      .minimizer(jsMinifierConfig.name)
      .use(jsMinifierConfig.plugin, [jsMinifierConfig.options])
  }

  if (cssMinifier !== CSSMinifier.none) {
    const cssMinifierConfigs = {
      [CSSMinifier.lightningcss]: {
        name: `${CHAIN_ID.MINIMIZER.CSS}-${CSSMinifier.lightningcss}`,
        plugin:
          bundlerType === 'rspack'
            ? rspack.LightningCssMinimizerRspackPlugin
            : CSSMinimizerWebpackPlugin,
        options: {
          ...(bundlerType === 'webpack'
            ? {
                minify: CSSMinimizerWebpackPlugin.lightningCssMinify,
                minimizerOptions: {
                  ...userConfig.cssMinifierOptions,
                },
              }
            : userConfig.cssMinifierOptions),
        },
      },
      [CSSMinifier.esbuild]: {
        name: `${CHAIN_ID.MINIMIZER.CSS}-${CSSMinifier.esbuild}`,
        plugin: CSSMinimizerWebpackPlugin,
        options: {
          minify: CSSMinimizerWebpackPlugin.esbuildMinify,
          minimizerOptions: {
            target: esbuildTarget,
            supported: {
              'inset-property': false,
            },
            ...userConfig.cssMinifierOptions,
          },
        },
      },
      [CSSMinifier.cssnano]: {
        name: `${CHAIN_ID.MINIMIZER.CSS}-${CSSMinifier.cssnano}`,
        plugin: CSSMinimizerWebpackPlugin,
        options: {
          minify: CSSMinimizerWebpackPlugin.cssnanoMinify,
          minimizerOptions: {
            ...userConfig.cssMinifierOptions,
          },
        },
      },
    }

    const cssMinifierConfig = cssMinifierConfigs[cssMinifier]
    if (!cssMinifierConfig) {
      throw new Error(`不支持的 CSS 压缩器 ${cssMinifier}。`)
    }
    logger.verbose(`使用 ${cssMinifierConfig.name} 压缩 CSS。`)
    config.optimization
      .minimizer(cssMinifierConfig.name)
      .use(cssMinifierConfig.plugin, [cssMinifierConfig.options])
  }
}
