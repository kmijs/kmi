import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyManifest(opts: SharedConfigOptions) {
  const { config, userConfig, bundler } = opts
  if (userConfig.manifest) {
    config.plugin(CHAIN_ID.PLUGIN.MANIFEST).use(bundler.ManifestPlugin, [
      {
        fileName: 'asset-manifest.json',
        ...userConfig.manifest,
      },
    ])
  }
}
