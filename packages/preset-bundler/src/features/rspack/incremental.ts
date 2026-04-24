import type { IApi } from '@kmijs/types'

export function applyIncremental(api: IApi) {
  api.bundlerChain((config) => {
    if (api.config.rspack?.incremental && api.env === 'development') {
      api.logger.info('Rspack incremental is enabled')
      config.merge({
        incremental: api.env === 'development',
      })
      config.experiments({
        ...config.toConfig().experiments,
      })
    }
    return config
  })
}
