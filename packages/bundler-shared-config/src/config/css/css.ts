import { CSSMinifier } from '@kmijs/bundler-compiled'
import { CHAIN_ID } from '@kmijs/bundler-shared'
import { reduceConfigs } from '@kmijs/bundler-shared/compiled/reduce-configs'
import type { LightningcssLoaderOptions } from '@kmijs/bundler-shared/rspack'
import { logger } from '@kmijs/shared'
import type { SharedConfigOptions } from '../../types'
import { getLessLoaderOptions } from './utils'

export function applyCss(opts: SharedConfigOptions) {
  const { config, userConfig, bundler, bundlerType } = opts

  const isRspack = bundlerType === 'rspack'

  const enableLessWoker =
    isRspack && userConfig.rspack?.enableLessWoker !== false

  if (enableLessWoker && !process.env.KMI_CLI_TEST) {
    logger.info('启用 less 多线程编译')
  }

  if (isRspack && userConfig.lightningcssLoader === false) {
    logger.verbose(
      '[rspack] 关闭 lightningcss, 启用 postcss 处理 css 降级, 会导致 CSS 编译变慢',
    )
  }

  const lessLoaderOptions = getLessLoaderOptions(opts, enableLessWoker)

  const rulesConfig = [
    { name: 'css', test: /\.css(\?.*)?$/ },
    enableLessWoker
      ? {
          name: 'less',
          test: /\.less(\?.*)?$/,
          // 多线程编译 实现 less-loader 配置不支持 函数
          loader: process.env.KMI_CLI_TEST
            ? require.resolve('../../../dist/config/css/less/index.js')
            : require.resolve('./less/index'),
          loaderOptions: lessLoaderOptions,
        }
      : {
          name: 'less',
          test: /\.less(\?.*)?$/,
          loader: require.resolve(
            '@kmijs/bundler-compiled/compiled/less-loader',
          ),
          loaderOptions: lessLoaderOptions,
        },
    {
      name: 'sass',
      test: /\.(sass|scss)(\?.*)?$/,
      loader: require.resolve('@kmijs/bundler-compiled/compiled/sass-loader'),
      loaderOptions: userConfig.sassLoader || {},
    },
    {
      name: 'stylus',
      test: /\.(styl|stylus)(\?.*)?$/,
      loader: require.resolve('@kmijs/bundler-compiled/compiled/stylus-loader'),
      loaderOptions: userConfig.stylusLoader || {},
    },
  ]

  for (const { name, test, loader, loaderOptions } of rulesConfig) {
    const rule = config.module.rule(name)
    const nestRulesConfig = [
      userConfig.autoCSSModules && {
        rule: rule
          .test(test)
          .oneOf('css-modules')
          .resourceQuery(/modules/)
          .sideEffects(true),
        isAutoCSSModuleRule: true,
      },
      {
        rule: rule.test(test).oneOf('css').sideEffects(true),
        isAutoCSSModuleRule: false,
      },
    ].filter(Boolean)
    // @ts-ignore
    for (const { rule, isAutoCSSModuleRule } of nestRulesConfig) {
      if (userConfig.styleLoader) {
        rule
          .use('style-loader')
          .loader(
            require.resolve('@kmijs/bundler-compiled/compiled/style-loader'),
          )
          .options({ base: 0, esModule: true, ...userConfig.styleLoader })
      } else {
        rule
          // 这里还是用的 mini-css-extract-plugin 兼容 kmi-plugin-pages 插件
          .use(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT)
          .loader(bundler.CssExtractPlugin.loader)
          .options({
            // publicPath: cssPublicPath,
            emit: true,
            esModule: true,
            ...userConfig.cssExtractLoader,
          })
      }

      const localIdentName = '[local]___[hash:base64:5]'

      let cssLoaderModulesConfig: any
      if (isAutoCSSModuleRule) {
        cssLoaderModulesConfig = {
          localIdentName,
          ...userConfig.cssLoaderModules,
        }
      } else if (userConfig.normalCSSLoaderModules) {
        cssLoaderModulesConfig = {
          localIdentName,
          auto: true,
          ...userConfig.normalCSSLoaderModules,
        }
      }

      rule
        .use('css-loader')
        .loader(require.resolve('@kmijs/bundler-compiled/compiled/css-loader'))
        .options({
          importLoaders: userConfig.extraPostCSSPlugins ? 2 : 1,
          esModule: true,
          url: {
            filter: (url: string) => {
              // Don't parse absolute URLs
              // ref: https://github.com/webpack-contrib/css-loader#url
              if (url.startsWith('/')) return false
              return true
            },
          },
          import: true,
          modules: cssLoaderModulesConfig,
          ...userConfig.cssLoader,
        })

      let extraPostCSSPlugins = userConfig.extraPostCSSPlugins || []

      // builtin:lightningcss-loader 必须配合 LightningCssMinimizerRspackPlugin 一起使用
      if (
        userConfig.lightningcssLoader !== false &&
        isRspack &&
        userConfig.cssMinifier === CSSMinifier.lightningcss
      ) {
        const userOptions =
          userConfig.lightningcssLoader === true
            ? {}
            : userConfig.lightningcssLoader

        const loaderOptions = reduceConfigs<LightningcssLoaderOptions>({
          initial: {
            targets: opts.browsers,
          },
          config: userOptions,
        })

        rule
          .use('lightningcssLoader')
          .loader('builtin:lightningcss-loader')
          .options(loaderOptions)
      } else {
        // css 降级支持
        // 正确的做法是确保 userConfig.extraPostCSSPlugins 是一个数组，然后添加必要的插件
        extraPostCSSPlugins = [
          require('@kmijs/bundler-compiled/compiled/postcss-flexbugs-fixes'),
          require('@kmijs/bundler-compiled/compiled/postcss-preset-env')({
            browsers: opts.browsers,
            autoprefixer: {
              flexbox: 'no-2009',
              ...userConfig.autoprefixer,
            },
            stage: 3,
            features: {
              'logical-properties-and-values': true,
            },
          }),
          ...(userConfig.extraPostCSSPlugins || []),
        ]
      }

      // 如果有使用 postcss 插件, 启用 postcss-loader
      if (extraPostCSSPlugins && extraPostCSSPlugins.length > 0) {
        rule
          .use('postcss-loader')
          .loader(
            require.resolve('@kmijs/bundler-compiled/compiled/postcss-loader'),
          )
          .options({
            postcssOptions: {
              ident: 'postcss',
              plugins: extraPostCSSPlugins,
              ...userConfig.postcssLoader,
            },
          })
      }

      if (loader) {
        rule
          .use(`${name}-loader`)
          .loader(loader)
          .options(loaderOptions || {})
      }
    }
  }
}
