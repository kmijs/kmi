// @ts-ignore
import { BundleAnalyzerPlugin } from '@kmijs/bundler-compiled/compiled/webpack-bundle-analyzer'
import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyBundleAnalyzer(opts: SharedConfigOptions) {
  const { config } = opts
  config.plugin(CHAIN_ID.PLUGIN.BUNDLE_ANALYZER).use(BundleAnalyzerPlugin, [
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    {
      analyzerMode: 'server',
      analyzerPort: process.env.ANALYZE_PORT || 8888,
      openAnalyzer: false,
      logLevel: 'info',
      defaultSizes: 'parsed',
      ...opts.userConfig.analyze,
    },
  ])
}
