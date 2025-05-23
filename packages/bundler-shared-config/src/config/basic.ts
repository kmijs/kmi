import { CHAIN_ID } from '@kmijs/bundler-shared'
import { winPath } from '@kmijs/shared'
import { DEFAULT_DEVTOOL } from '../constants'
import type { SharedConfigOptions } from '../types'
import { Env } from '../types'

export function applyBasic(opts: SharedConfigOptions) {
  const { name, config, userConfig, bundler } = opts

  const isDev = opts.env === Env.development

  // name
  config.name(name)

  // mode
  config.mode(opts.env)
  config.stats('none')

  // entry
  Object.keys(opts.entry).forEach((key) => {
    const entry = config.entry(key)
    if (isDev && opts.hmr) {
      entry.add('../../client/client/client')
    }
    entry.add(opts.entry[key])
  })

  // Disable performance hints, these logs are too complex
  config.performance.hints(false)

  // https://rspack.dev/zh/config/module#moduleparserjavascriptexportspresence
  // 当配置了 javascriptExportsPresence  false 使用了不存在的导出或存在冲突的重导出时，不进行报错。
  config.module.parser.merge({
    javascript: {
      exportsPresence:
        userConfig?.javascriptExportsPresence !== false ? 'error' : 'warn',
    },
  })

  // devtool
  config.devtool(
    isDev
      ? userConfig.devtool === false
        ? false
        : userConfig.devtool || DEFAULT_DEVTOOL
      : userConfig.devtool!,
  )

  // resolve
  // prettier-ignore
  config.resolve
    .set('symlinks', true)
    .modules
      .add('node_modules')
      .end()
    .alias
      .merge(userConfig.alias || {})
      .end()
    .extensions
      .merge(userConfig.extensions || [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.mjs',
        '.cjs',
        '.json',
        '.wasm'
      ])
      .end();

  // externals
  config.externals(userConfig.externals || [])

  // experiments
  config.experiments({
    topLevelAwait: true,
    outputModule: !!userConfig.esm,
  })

  config.infrastructureLogging({
    level: 'warn',
  })

  // hmr
  if (isDev && opts.hmr) {
    config.plugin(CHAIN_ID.PLUGIN.HMR).use(bundler.HotModuleReplacementPlugin)
  }
}
