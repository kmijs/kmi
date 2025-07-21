import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'removeConsole',
    config: {
      schema({ zod }) {
        return zod.union([
          zod.boolean(),
          zod.array(zod.enum(['error', 'warn', 'info', 'log'])),
        ])
      },
    },
    enableBy: api.EnableBy.config,
  })

  api.onCheckConfig(({ userConfig }) => {
    if (userConfig.jsMinifier === 'uglifyJs') {
      throw new Error('removeConsole does not support uglifyJs')
    }
    if (api.appData.bundler === 'webpack' && userConfig.jsMinifier === 'swc') {
      throw new Error('removeConsole does not support using swc compression in webpack mode')
    }
  })

  api.modifyConfig((memo) => {
    const { removeConsole } = memo
    const isRspack = api.appData.bundler === 'rspack'
    // 默认是 esbuild
    const jsMinifier =
      api.appData.bundler === 'rspack'
        ? api.userConfig.jsMinifier || 'swc'
        : api.userConfig.jsMinifier || 'esbuild'

    const compressOptions = Array.isArray(removeConsole)
      ? { pure_funcs: removeConsole.map((method) => `console.${method}`) }
      : { drop_console: true }

    if (isRspack && jsMinifier === 'swc') {
      memo.jsMinifierOptions = {
        ...memo.jsMinifierOptions,
        minimizerOptions: {
          ...memo.jsMinifierOptions?.minimizerOptions,
          compress: {
            ...memo.jsMinifierOptions?.minimizerOptions?.compress,
            ...compressOptions,
          },
        },
      }
      return memo
    }

    // esbuild
    if (jsMinifier === 'esbuild') {
      const compressOptions = Array.isArray(removeConsole)
        ? { pure: removeConsole.map((method) => `console.${method}`) }
        : { drop: ['console'] }
      memo.jsMinifierOptions = {
        ...memo.jsMinifierOptions,
        ...compressOptions,
      }
      return memo
    }

    // terser
    if (jsMinifier === 'terser') {
      memo.jsMinifierOptions = {
        ...memo.jsMinifierOptions,
        compress: {
          ...memo.jsMinifierOptions?.compress,
          ...compressOptions,
        },
      }
      return memo
    }
    return memo
  })
}
