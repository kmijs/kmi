import type { LoaderContext } from '@kmijs/bundler-shared/rspack'
import type { SharedConfigOptions } from '../../types'

export function getLessLoaderOptions(
  opts: SharedConfigOptions,
  enableLessWoker: boolean,
) {
  const { userConfig, bundlerType } = opts
  const lessLoaderOptions: Record<string, any> = {}

  if (bundlerType === 'webpack' || !enableLessWoker) {
    lessLoaderOptions.implementation = require.resolve(
      '@kmijs/bundler-shared/compiled/less',
    )
  }

  const lessLoader = userConfig.lessLoader

  if (typeof lessLoader === 'object' && lessLoader.additionalData) {
    lessLoaderOptions.additionalData = lessLoader.additionalData
    delete lessLoader.additionalData
  }

  // 如果 lessLoader 中包含 lessOptions 则使用 lessOptions 中的配置, 兼容老项目
  if (typeof lessLoader === 'object' && lessLoader.lessOptions) {
    lessLoaderOptions.lessOptions = (loaderContext: LoaderContext) => {
      return {
        modifyVars: userConfig.theme,
        javascriptEnabled: true,
        ...(typeof lessLoader.lessOptions === 'function'
          ? lessLoader.lessOptions(loaderContext)
          : lessLoader.lessOptions),
      }
    }
    return lessLoaderOptions
  }

  lessLoaderOptions.lessOptions = (loaderContext: LoaderContext) => ({
    modifyVars: userConfig.theme,
    javascriptEnabled: true,
    ...(typeof lessLoader === 'function'
      ? lessLoader(loaderContext)
      : lessLoader),
  })

  return lessLoaderOptions
}
