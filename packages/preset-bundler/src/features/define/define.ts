import type { IApi } from '@kmijs/types'
import { BundlerTypeEnum } from '@kmijs/types'
import { resolveDefine } from './resolveDefine'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:define',
  })

  api.bundlerChain((config, { bundler }) => {
    config.plugin('define').use(bundler.DefinePlugin, [
      resolveDefine({
        userConfig: api.config,
        bundler: api.appData.bundler || BundlerTypeEnum.webpack,
        port: api.appData.port,
        host: api.appData.host,
        isDev: api.name === 'dev',
        isProd: api.name === 'build',
      }),
    ] as any)
    return config
  })
}
