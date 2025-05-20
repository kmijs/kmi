import type { Compiler, Stats } from '@kmijs/bundler-shared/rspack'

const PLUGIN_NAME = 'ParalleLessPlugin'

class ParalleLessPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.done.tap(PLUGIN_NAME, (stats: Stats) => {
      if (stats.compilation.__parallelLessLoader) {
        // 销毁 piscina 实例
        // @ts-expect-error
        stats.compilation.__parallelLessLoader.__terminate()
        stats.compilation.__parallelLessLoader = undefined
      }
    })
  }
}

export default ParalleLessPlugin
