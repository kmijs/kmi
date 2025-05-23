import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.modifyDefaultConfig((memo) => {
    memo.polyfill = false
    return memo
  })

  api.modifyBundlerConfig((memo) => {
    delete memo.experiments?.cache
    return memo
  })
}
