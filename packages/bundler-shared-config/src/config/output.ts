import { pathe } from '@kmijs/shared'

import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'
import { Env } from '../types'
import { getFilename } from '../utils/getFilename'
import { getOutputPath } from '../utils/getOutputPath'
export function applyOutput(opts: SharedConfigOptions) {
  const { config, userConfig, useHash, staticPathPrefix, bundler } = opts

  const isDev = opts.env === Env.development

  // output
  const absOutputPath = pathe.resolve(opts.cwd, getOutputPath(opts, 'root'))
  const jsPath = getOutputPath(opts, 'js')
  const jsFilename = getFilename(opts, 'js')
  const isJsFilenameFn = typeof jsFilename === 'function'

  const jsAsyncFilename = getFilename(opts, 'jsAsync')
  const isJsAsyncFilenameFn = typeof jsAsyncFilename === 'function'

  const disableCompress = process.env.COMPRESS === 'none'
  config.output
    .path(absOutputPath)
    .filename(
      isJsFilenameFn
        ? (...args) => {
            const name = jsFilename(...args)
            return pathe.join(jsPath, name)
          }
        : pathe.join(jsPath, jsFilename),
    )
    .chunkFilename(
      isJsAsyncFilenameFn
        ? (...args) => {
            const name = jsAsyncFilename(...args)
            return pathe.join(jsPath, name)
          }
        : pathe.join(jsPath, jsAsyncFilename),
    )
    .publicPath(userConfig.publicPath || 'auto')
    .pathinfo(isDev || disableCompress)
    .set(
      'assetModuleFilename',
      useHash
        ? `${staticPathPrefix}[name].[contenthash:8][ext]`
        : `${staticPathPrefix}[name][ext]`,
    )
    .set('hashFunction', 'xxhash64') // https://github.com/webpack/webpack/issues/14532#issuecomment-947525539

  // css output
  if (!userConfig.styleLoader) {
    const cssPath = getOutputPath(opts, 'css')
    const cssFilename = getFilename(opts, 'css')
    const cssAsyncFilename = getFilename(opts, 'cssAsync')

    const isCssFilenameFn = typeof cssFilename === 'function'
    const isCssAsyncFilenameFn = typeof cssAsyncFilename === 'function'

    config
      .plugin(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT)
      .use(bundler.CssExtractPlugin, [
        {
          filename: isCssFilenameFn
            ? (...args: any) => {
                // @ts-expect-error
                const name = cssFilename(...args)
                return pathe.join(cssPath, name)
              }
            : pathe.join(cssPath, cssFilename),
          chunkFilename: isCssAsyncFilenameFn
            ? (...args: any) => {
                // @ts-expect-error
                const name = cssAsyncFilename(...args)
                return pathe.join(cssPath, name)
              }
            : pathe.join(cssPath, cssAsyncFilename),
          ignoreOrder: true,
        },
      ])
  }
}
