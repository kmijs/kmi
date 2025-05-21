import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:transformConfig',
  })

  // Compatible with naming conflicts caused by some pre-occupied keys in umi
  api.modifyConfig((memo) => {
    if (memo.cssMinifier === 'parcelCSS') {
      memo.cssMinifier = 'lightningcss'
    }

    if (memo.swcLoader) {
      memo.swc = memo.swcLoader
    }
    return memo
  })
}
