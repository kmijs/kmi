import type { IApi } from '@kmijs/types'

export function applyLazyCompilation(api: IApi) {
  api.bundlerChain((config) => {
    if (api.config.rspack?.lazyCompilation && api.env === 'development') {
      api.logger.info('Rspack Lazy compilation is enabled')
      config.experiments({
        ...config.toConfig().experiments,
        lazyCompilation: {
          test(module: any) {
            // prevent dev-client.js from being lazy compiled
            const isMyClient = module
              .nameForCondition()
              .endsWith('client/client.js')
            return !isMyClient
          },
        },
      })
    }
    return config
  })
}
