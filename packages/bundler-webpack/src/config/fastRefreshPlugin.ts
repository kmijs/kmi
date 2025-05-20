import { CHAIN_ID } from '@kmijs/bundler-shared'
import { Env } from '@kmijs/bundler-shared-config'
// @ts-ignore
import FastRefreshPlugin from '../../compiled/@pmmmwh/react-refresh-webpack-plugin/lib'
import type { IApplyOpts } from './config'

export async function addFastRefreshPlugin(opts: IApplyOpts) {
  const { config, userConfig } = opts
  const isDev = opts.env === Env.development
  const useFastRefresh = isDev && userConfig.fastRefresh !== false
  // TODO: Should only run in react csr
  if (useFastRefresh) {
    config
      .plugin(CHAIN_ID.PLUGIN.REACT_FAST_REFRESH)
      .after(CHAIN_ID.PLUGIN.HMR)
      .use(FastRefreshPlugin, [{ overlay: false }])
  }
}
