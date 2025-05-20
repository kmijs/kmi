import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyIgnore(opts: SharedConfigOptions) {
  const { config, userConfig, bundler } = opts
  if (userConfig.ignoreMomentLocale) {
    config
      .plugin(CHAIN_ID.PLUGIN.IGNORE_MOMENT_LOCALE)
      .use(bundler.IgnorePlugin, [
        {
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        },
      ])
  }
}
