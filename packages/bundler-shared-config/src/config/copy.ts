import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyCopy(opts: SharedConfigOptions) {
  const { config, userConfig, cwd, bundler } = opts

  const publicDir = join(cwd, 'public')
  const copyPatterns = [
    existsSync(publicDir) &&
      readdirSync(publicDir).length && {
        from: publicDir,
        // ref: https://github.com/webpack-contrib/copy-webpack-plugin#info
        // Set minimized so terser will not do minimize
        info: { minimized: true },
      },
    ...(userConfig.copy
      ? userConfig.copy.map((pattern) => {
          if (typeof pattern === 'string') {
            return {
              from: resolve(cwd, pattern),
              info: { minimized: true },
            }
          }
          return {
            from: resolve(cwd, pattern.from),
            to: resolve(cwd, pattern.to),
            info: { minimized: true },
          }
        })
      : []),
  ].filter(Boolean)
  if (copyPatterns.length) {
    config.plugin(CHAIN_ID.PLUGIN.COPY).use(bundler.CopyPlugin, [
      {
        patterns: copyPatterns,
      },
    ])
  }
}
