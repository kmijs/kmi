import { Env } from '@kmijs/bundler-shared-config'
import { rspack } from '@kmijs/bundler-shared/rspack'
import ProgressPlugin from '../plugins/ProgressPlugin'
import type { IApplyOpts } from './config'

export async function addProgressPlugin(opts: IApplyOpts) {
  const { config, name, env } = opts
  if (env === Env.production) {
    config.plugin('progress-plugin').use(rspack.ProgressPlugin, [
      {
        prefix: name || 'kmi',
        template:
          '🟢 {prefix:.bold.green} {bar:45.green/bold.white.dim} ({percent}%) {wide_msg:.dim}',
        progressChars: '█▓░',
        tick: ['构建中 ...'],
      },
    ])
  } else {
    config.plugin('progress-plugin-dev').use(ProgressPlugin, [
      {
        name: name || 'Kmi',
      },
    ])
  }
}
