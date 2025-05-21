import { dirname } from 'node:path'
import { importLazy } from 'umi/plugin-utils'

export const lazyImportFromCurrentPkg = (depName: string) => {
  return importLazy(dirname(require.resolve(`${depName}/package.json`)))
}

const bundlerWebpack: typeof import('@kmijs/bundler-webpack') =
  lazyImportFromCurrentPkg('@kmijs/bundler-webpack')

const bundlerRspack: typeof import('@kmijs/bundler-rspack') = process.env
  .BUNDLER_RSPACK
  ? require(process.env.BUNDLER_RSPACK)
  : lazyImportFromCurrentPkg('@kmijs/bundler-rspack')

export { bundlerWebpack, bundlerRspack }
