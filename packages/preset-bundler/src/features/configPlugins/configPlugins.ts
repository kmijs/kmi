import type { IApi } from '@kmijs/types'
import { configDefaults, schema } from './schema'
import { registerKmiConfig } from '@kmijs/types'
export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:configPlugins',
  })

  registerKmiConfig(schema, configDefaults, api)
}
