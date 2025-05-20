import type { Compilation, Compiler } from '../../compiled/webpack'

const PLUGIN_NAME = 'SamplePlugin'

interface IOpts {
  [key: string]: any
}

class _SamplePlugin {
  public options: IOpts

  constructor(options: IOpts = {}) {
    this.options = options
  }

  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
      compilation.hooks.chunkHash.tap(PLUGIN_NAME, () => {})
    })
  }
}

export default _SamplePlugin
