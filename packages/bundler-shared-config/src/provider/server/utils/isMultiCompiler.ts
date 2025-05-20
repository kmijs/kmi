import type { Compiler, MultiCompiler } from '@kmijs/bundler-shared/rspack'

export const isMultiCompiler = <
  C extends Compiler = Compiler,
  M extends MultiCompiler = MultiCompiler,
>(
  compiler: C | M,
): compiler is M => {
  return 'compilers' in compiler && Array.isArray(compiler.compilers)
}
