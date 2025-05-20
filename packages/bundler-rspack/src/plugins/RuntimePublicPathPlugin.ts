import type { Compilation, Compiler } from '@kmijs/bundler-shared/rspack'

const PLUGIN_NAME = 'RuntimePublicPath'

// ref: https://gist.github.com/ScriptedAlchemy/60d0c49ce049184f6ce3e86ca351fdca
export class RuntimePublicPathPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.make.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.runtimeModule.tap(PLUGIN_NAME, (module) => {
        // The hook to get the public path ('__webpack_require__.p')
        // https://github.com/webpack/webpack/blob/master/lib/runtime/PublicPathRuntimeModule.js
        if (module.constructorName === 'PublicPathRuntimeModule') {
          if (module.source) {
            // If current public path is handled by mini-css-extract-plugin, skip it
            const originSource = module.source?.source.toString('utf-8')
            if (originSource?.includes('webpack:///mini-css-extract-plugin'))
              return
            // @ts-ignore
            module.source.source = Buffer.from(
              `__webpack_require__.p = (typeof globalThis !== 'undefined' ? globalThis : window).publicPath || '/';`,
              'utf-8',
            )
          }
        }
      })
    })
  }
}
