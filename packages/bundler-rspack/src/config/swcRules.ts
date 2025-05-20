import path, { dirname, isAbsolute } from 'node:path'
import { CHAIN_ID, depMatch } from '@kmijs/bundler-shared'
import type { SwcLoaderOptions } from '@kmijs/bundler-shared/rspack'
import type Config from '@kmijs/bundler-shared/rspack-chain'
import { chalk, deepmerge, lodash, logger, resolve } from '@kmijs/shared'
import type { IConfig } from '../types'
import { applyUserBabelConfig, getDefaultBabelOptions } from '../utils/babel'
import type { IApplyOpts } from './config'

function getDefaultSwcConfig(opts: {
  cacheRoot: string
  extraSwcPlugins: Array<[string, any]>
  userConfig: IConfig
  targets: string[]
}): SwcLoaderOptions {
  return {
    jsc: {
      externalHelpers: true,
      parser: {
        tsx: false,
        syntax: 'typescript',
        decorators: true,
      },
      // Avoid the webpack magic comment to be removed
      // https://github.com/swc-project/swc/issues/6403
      preserveAllComments: true,
      experimental: {
        cacheRoot: opts.cacheRoot,
        // @ts-expect-error
        plugins: [
          ...(opts.userConfig.autoCSSModules
            ? [[require.resolve('@ksuni/swc-plugin-auto-css-modules'), {}]]
            : []),
          ...opts.extraSwcPlugins,
          ...(opts.userConfig.extraSwcPlugins || []).filter(Boolean),
        ],
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
        // see: https://github.com/swc-project/swc/issues/6571
        useDefineForClassFields: true,
      },
    },
    isModule: 'unknown',
    env: {
      targets: opts.targets,
    },
  }
}

const RULE_IDS = [CHAIN_ID.RULE.JS_SRC, CHAIN_ID.RULE.JSX_TS_TSX]

export async function addSwcRules(opts: IApplyOpts) {
  const { config, userConfig, cwd } = opts

  const cacheRoot = path.join(cwd, 'node_modules', '.cache/.swc')
  let swcConfig = getDefaultSwcConfig({
    cacheRoot,
    extraSwcPlugins: opts.extraSwcPlugins || [],
    userConfig: opts.userConfig,
    targets: opts.browsers,
  })

  // 提供钩子修改
  if (opts.modifySwcLoaderOptions) {
    swcConfig = await opts.modifySwcLoaderOptions(swcConfig, {
      env: opts.env,
      target: opts.target,
      isServer: opts.target === 'node',
      isWebWorker: opts.target === 'web-worker',
    })
  }

  // 用户配置
  const mergedSwcConfig = deepmerge(swcConfig, userConfig.swc || {})

  if (mergedSwcConfig.jsc?.externalHelpers) {
    config.resolve.alias.set(
      '@swc/helpers',
      path.dirname(require.resolve('@swc/helpers/package.json')),
    )
  }

  logger.verbose('[bundler-rspack] swcConfig:', mergedSwcConfig)

  const depPkgs = Object.assign({}, depMatch.es5ImcompatibleVersionsToPkg())

  const srcRules = [
    config.module
      .rule(CHAIN_ID.RULE.JS_SRC)
      .test(/\.(js|mjs|cjs)$/)
      .include.add([
        cwd,
        // import module out of cwd using APP_ROOT
        // issue: https://github.com/umijs/umi/issues/5594
        ...(process.env.APP_ROOT ? [process.cwd()] : []),
      ])
      .end()
      .exclude.add(/node_modules/)
      .end(),
    config.module.rule(CHAIN_ID.RULE.JSX_TS_TSX).test(/\.(jsx|ts|tsx)$/),
    config.module
      .rule(CHAIN_ID.RULE.JS_EXTRA_SRC)
      .test(/\.(js|mjs|cjs)$/)
      .include.add([
        // support extraBabelIncludes
        ...opts.extraBabelIncludes.map((p) => {
          // regexp
          if (lodash.isRegExp(p)) {
            return p
          }

          // handle absolute path
          if (isAbsolute(p)) {
            return p
          }

          // resolve npm package name
          try {
            if (p.startsWith('./')) {
              return require.resolve(p, { paths: [cwd] })
            }
            // use resolve instead of require.resolve
            // since require.resolve may meet the ERR_PACKAGE_PATH_NOT_EXPORTED error
            return dirname(
              resolve.sync(`${p}/package.json`, {
                basedir: cwd,
                // same behavior as webpack, to ensure `include` paths matched
                // ref: https://webpack.js.org/configuration/resolve/#resolvesymlinks
                preserveSymlinks: false,
              }),
            )
          } catch (e: any) {
            if (e.code === 'MODULE_NOT_FOUND') {
              throw new Error(`Cannot resolve extraBabelIncludes: ${p}`, {
                cause: e,
              })
            }
            throw e
          }
        }),
        // support es5ImcompatibleVersions
        (path: string) => {
          try {
            // do src transform for bundler-webpack/client/client/client.js
            if (path.includes('client/client/client')) return true
            return depMatch.isMatch({ path, pkgs: depPkgs })
          } catch (e) {
            console.error(chalk.red(e))
            throw e
          }
        },
      ])
      .end(),
  ] as Config.Rule<Config.Module>[]

  srcRules.forEach((rule) => rule.resolve.set('fullySpecified', false))

  srcRules.forEach((rule) => {
    rule
      .use(CHAIN_ID.USE.SWC)
      .loader('builtin:swc-loader')
      .options(mergedSwcConfig)
  })

  if (userConfig.mdx) {
    config.module
      .rule('mdx')
      .type('javascript/auto')
      .test(/\.mdx?$/)
      .oneOf('MDXCompile')
      .use('builtin:swc-loader')
      .loader('builtin:swc-loader')
      .options(mergedSwcConfig)
      .end()
      .use('mdx-loader')
      .loader(userConfig.mdx?.loader)
      .options(userConfig.mdx?.loaderOptions)
  }

  if (
    userConfig.rspack?.useBabel &&
    (opts.extraBabelPlugins || opts.extraBabelPresets)
  ) {
    await addBabelRules(opts)
  }
}

async function addBabelRules(opts: IApplyOpts) {
  const { config, userConfig, target } = opts

  const baseOptions = await getDefaultBabelOptions({
    ...opts,
    transpiler: 'extra-babel',
  })

  const babelOptions = applyUserBabelConfig(
    deepmerge({}, baseOptions),
    // @ts-expect-error
    userConfig.rspack.__babelLoaderOptions,
    {
      isWebWorker: target === 'web-worker',
      isServer: target === 'node',
    },
  )

  logger.verbose('[bundler-rspack] babelOptions:', babelOptions)
  logger.info('当前存在 babel 插件、开启 babel 插件消费')

  RULE_IDS.forEach((ruleId) => {
    const rule = config.module.rule(ruleId)
    rule
      .use(CHAIN_ID.USE.BABEL)
      .after(CHAIN_ID.USE.SWC)
      .loader(require.resolve('@kmijs/bundler-compiled/compiled/babel-loader'))
      .options(babelOptions)
  })
}
