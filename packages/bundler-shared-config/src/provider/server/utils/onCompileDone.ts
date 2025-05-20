import type {
  Compiler,
  MultiCompiler,
  MultiStats,
  Stats,
} from '@kmijs/bundler-shared/rspack'
import { isMultiCompiler } from './isMultiCompiler'

export const onCompileDone = (
  compiler: Compiler | MultiCompiler,
  onDone: (stats: Stats | MultiStats) => Promise<void>,
  MultiStatsCtor: new (stats: Stats[]) => MultiStats,
): void => {
  // The MultiCompiler of Rspack does not supports `done.tapPromise`,
  // so we need to use the `done` hook of `MultiCompiler.compilers` to implement it.
  if (isMultiCompiler(compiler)) {
    const { compilers } = compiler
    const compilerStats: Stats[] = []
    let doneCompilers = 0

    for (let index = 0; index < compilers.length; index++) {
      const compiler = compilers[index]
      const compilerIndex = index
      let compilerDone = false

      compiler.hooks.done.tapPromise('kmi:done', async (stats) => {
        if (!compilerDone) {
          compilerDone = true
          doneCompilers++
        }

        compilerStats[compilerIndex] = stats

        const lastCompilerDone = doneCompilers === compilers.length
        if (lastCompilerDone) {
          await onDone(new MultiStatsCtor(compilerStats))
        }
      })

      compiler.hooks.invalid.tap('kmi:done', () => {
        if (compilerDone) {
          compilerDone = false
          doneCompilers--
        }
      })
    }
  } else {
    compiler.hooks.done.tapPromise('kmi:done', onDone)
  }
}
