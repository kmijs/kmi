import type { IApi } from '@kmijs/types'

export function applyIncremental(api: IApi) {
  api.bundlerChain((config) => {
    if (api.config.rspack?.incremental && api.env === 'development') {
      api.logger.info('Rspack incremental is enabled')
      config.experiments({
        ...config.toConfig().experiments,
        incremental: api.env === 'development',
      })
    }
    return config
  })
}
