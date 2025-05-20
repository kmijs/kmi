import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyRuntimePublicPath(opts: SharedConfigOptions) {
  const { config, bundler, userConfig } = opts
  if (userConfig.runtimePublicPath) {
    config
      .plugin(CHAIN_ID.PLUGIN.RUNTIME_PUBLIC_PATH)
      .use(bundler.RuntimePublicPathPlugin)
  }
}
