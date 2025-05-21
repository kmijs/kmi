import { dirname, isAbsolute } from 'node:path'
import { CHAIN_ID, depMatch } from '@kmijs/bundler-shared'
import { Env } from '@kmijs/bundler-shared-config'
import type Config from '@kmijs/bundler-shared/rspack-chain'
import { lodash, picocolors, resolve } from '@kmijs/shared'
import { Transpiler } from '../types'
import type { IApplyOpts } from './config'

export async function addJavaScriptRules(opts: IApplyOpts) {
  const { config, userConfig, cwd } = opts
  const isDev = opts.env === Env.development
  const useFastRefresh = isDev && userConfig.fastRefresh !== false

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
          } catch (e: any) {
            console.error(picocolors.red(e))
            throw e
          }
        },
      ])
      .end(),
  ] as Config.Rule<Config.Module>[]
  if (userConfig.mdx) {
    srcRules.push(config.module.rule('markdown').test(/\.mdx?$/))
  }
  const depRules = [
    config.module
      .rule('dep')
      .test(/\.(js|mjs|cjs)$/)
      .include.add(/node_modules/)
      .end()
      .exclude.add((path: string) => {
        try {
          return depMatch.isMatch({ path, pkgs: depPkgs })
        } catch (e: any) {
          console.error(picocolors.red(e))
          throw e
        }
      })
      .end(),
  ]
  srcRules
    .concat(depRules)
    .forEach((rule) => rule.resolve.set('fullySpecified', false))

  console.log('opts.babelPreset', opts.babelPreset)

  // const prefix = existsSync(join(cwd, 'src')) ? join(cwd, 'src') : cwd;
  const srcTranspiler = userConfig.srcTranspiler || Transpiler.babel
  srcRules.forEach((rule) => {
    if (srcTranspiler === Transpiler.babel) {
      rule
        .use(CHAIN_ID.USE.BABEL)
        .loader(
          require.resolve('@kmijs/bundler-compiled/compiled/babel-loader'),
        )
        .options({
          // Tell babel to guess the type, instead assuming all files are modules
          // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
          sourceType: 'unambiguous',
          babelrc: false,
          configFile: false,
          cacheDirectory: false,
          browserslistConfigFile: false,
          // process.env.BABEL_CACHE !== 'none'
          //   ? join(cwd, `.umi/.cache/babel-loader`)
          //   : false,
          targets: userConfig.targets,
          // 解决 vue MFSU 解析 需要
          customize: userConfig.babelLoaderCustomize,
          presets: [
            opts.babelPreset || [
              require.resolve('@kmijs/babel-preset-react'),
              {
                presetEnv: {},
                presetReact: {},
                presetTypeScript: {},
                pluginTransformRuntime: {},
                pluginLockCoreJS: {},
                pluginDynamicImportNode: false,
                pluginAutoCSSModules: userConfig.autoCSSModules,
              },
            ],
            ...opts.extraBabelPresets,
            ...(userConfig.extraBabelPresets || []).filter(Boolean),
          ],
          plugins: [
            useFastRefresh && require.resolve('react-refresh/babel'),
            ...opts.extraBabelPlugins,
            ...(userConfig.extraBabelPlugins || []),
          ].filter(Boolean),
        })
    } else {
      throw new Error(`Unsupported srcTranspiler ${srcTranspiler}.`)
    }
  })

  if (userConfig.mdx) {
    config.module
      .rule('mdx')
      .test(/\.mdx?$/)
      .use('mdx-loader')
      .loader(userConfig.mdx?.loader)
      .options(userConfig.mdx?.loaderOptions)
  }

  const depTranspiler = userConfig.depTranspiler || Transpiler.none
  depRules.forEach((_rule) => {
    if (depTranspiler === Transpiler.none) {
      // noop
    } else {
      throw new Error(`Unsupported depTranspiler ${depTranspiler}.`)
    }
  })
}
