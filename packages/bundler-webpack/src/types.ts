import type { IBundlerConfig } from '@kmijs/bundler-shared-config'
import type { TransformOptions as EsbuildOptions } from '@kmijs/bundler-shared/esbuild'

export { Env } from '@kmijs/bundler-shared-config'

export enum Transpiler {
  babel = 'babel',
  esbuild = 'esbuild',
  none = 'none',
}

export interface ICopy {
  from: string
  to: string
}

export interface DeadCodeParams {
  patterns?: string[]
  exclude?: string[]
  failOnHint?: boolean
  detectUnusedFiles?: boolean
  detectUnusedExport?: boolean
  context?: string
}

export interface IConfig extends IBundlerConfig {
  cssMinifierOptions?: { [key: string]: any }
  depTranspiler?: `${Transpiler}`
  srcTranspiler?: `${Transpiler}`
  srcTranspilerOptions?: ISrcTranspilerOpts
  svgr?: { [key: string]: any }
  svgo?: { [key: string]: any } | false
  babelLoaderCustomize?: string
  esbuildMinifyIIFE?: boolean
  checkDepCssModules?: boolean
  [key: string]: any
}

export interface ISrcTranspilerOpts {
  esbuild?: Partial<EsbuildOptions>
}

export interface ISwcPluginOpts {
  enableAutoCssModulesPlugin?: boolean
}
