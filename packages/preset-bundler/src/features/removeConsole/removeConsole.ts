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
      throw new Error(
        'removeConsole does not support using swc compression in webpack mode',
      )
    }
  })

  api.modifyConfig((memo) => {
    const { removeConsole } = memo
    // Fix: Check for rspack config instead of bundler name
    const isRspack = !!memo.rspack || !!api.userConfig.rspack
    // Default is esbuild for webpack, swc for rspack
    const jsMinifier = isRspack
      ? api.userConfig.jsMinifier || 'swc'
      : api.userConfig.jsMinifier || 'esbuild'

    if (isRspack && jsMinifier === 'swc') {
      // SWC configuration issue: drop_console doesn't work in current Rspack version
      // Workaround: Automatically switch to terser when removeConsole is enabled

      // Force switch to terser for removeConsole functionality
      memo.jsMinifier = 'terser'

      // Apply terser configuration
      const compressOptions = Array.isArray(removeConsole)
        ? { pure_funcs: removeConsole.map((method) => `console.${method}`) }
        : { drop_console: true }

      memo.jsMinifierOptions = {
        ...memo.jsMinifierOptions,
        compress: {
          ...memo.jsMinifierOptions?.compress,
          ...compressOptions,
        },
      }
      return memo
    }

    const compressOptions = Array.isArray(removeConsole)
      ? { pure_funcs: removeConsole.map((method) => `console.${method}`) }
      : { drop_console: true }

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
