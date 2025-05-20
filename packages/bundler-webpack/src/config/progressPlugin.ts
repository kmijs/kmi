import { Env } from '@kmijs/bundler-shared-config'
import WebpackBar from '../../compiled/webpackbar'
import ProgressPlugin from '../plugins/ProgressPlugin'
import type { IApplyOpts } from './config'

export async function addProgressPlugin(opts: IApplyOpts) {
  const { config, name, env } = opts
  if (env === Env.production) {
    config.plugin('progress-plugin').use(WebpackBar, [
      {
        name: name || 'webpack',
      },
    ])
  } else {
    config.plugin('progress-plugin-dev').use(ProgressPlugin)
  }
}
