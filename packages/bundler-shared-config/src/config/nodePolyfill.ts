import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function addNodePolyfill(opts: SharedConfigOptions) {
  const { config } = opts
  const NodePolyfillPlugin = require('../../compiled/node-polyfill-webpack-plugin')

  config.plugin(CHAIN_ID.PLUGIN.NODE_POLYFILL).use(NodePolyfillPlugin, [{}])
}
