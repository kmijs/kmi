import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:configPlugins',
  })
}
