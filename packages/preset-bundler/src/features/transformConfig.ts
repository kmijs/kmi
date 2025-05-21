import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:transformConfig',
  })

  api.modifyConfig((memo) => {
    if (memo.cssMinifier === 'parcelCSS') {
      memo.cssMinifier = 'lightningcss'
    }
    return memo
  })
}
