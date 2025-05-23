import type { Configuration, IApi } from '@kmijs/types'

export default function (api: IApi): void {
  let webpackConfig: Configuration | null = null

  // @ts-expect-error
  api.modifyWebpackConfig((memo: Configuration) => {
    webpackConfig = memo
    return memo
  })

  api.registerCommand({
    name: '@@test:webpackConfig',
    configResolveMode: 'loose',
    async fn() {
      return webpackConfig
    },
  })

  api.registerCommand({
    name: '@@test:config',
    configResolveMode: 'loose',
    async fn() {
      return api.config
    },
  })

  api.registerCommand({
    name: '@@test:userConfig',
    configResolveMode: 'loose',
    async fn() {
      return api.userConfig
    },
  })

  api.registerCommand({
    name: '@@test:appData',
    configResolveMode: 'loose',
    async fn() {
      return api.appData
    },
  })
}
