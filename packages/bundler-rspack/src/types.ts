import type {
  PluginItem as BabelPlugin,
  TransformOptions as BabelTransformOptions,
} from '@kmijs/bundler-compiled/compiled/babel/core'
import type { KmiTarget } from '@kmijs/bundler-shared'
import { Env, type IBundlerConfig } from '@kmijs/bundler-shared-config'
import type {
  LightningcssLoaderOptions,
  SwcLoaderOptions,
} from '@kmijs/bundler-shared/rspack'

export enum Transpiler {
  babel = 'babel',
  swc = 'swc',
  none = 'none',
}

export { Env }

export interface DeadCodeParams {
  patterns?: string[]
  exclude?: string[]
  failOnHint?: boolean
  detectUnusedFiles?: boolean
  detectUnusedExport?: boolean
  context?: string
}

export type ExtraSwcPlugins = Array<[string, any]>

export type ModifySwcLoaderOptions = (
  options: SwcLoaderOptions,
  opts: {
    env: Env
    target: KmiTarget
    isServer: boolean
    isWebWorker: boolean
  },
) => SwcLoaderOptions

export interface IConfig extends IBundlerConfig {
  cssMinifierOptions?: { [key: string]: any }
  depTranspiler?: `${Transpiler}`
  srcTranspiler?: `${Transpiler}`
  srcTranspilerOptions?: Record<string, any>
  svgr?: { [key: string]: any }
  svgo?: { [key: string]: any } | false
  swc?: SwcLoaderOptions
  extraSwcPlugins?: ExtraSwcPlugins
  modifySwcLoaderOptions?: ModifySwcLoaderOptions
  lightningcssLoader?: boolean | LightningcssLoaderOptions
  [key: string]: any
}

export type BabelLoaderOptions = BabelTransformOptions & {
  /**
   * When set, the given directory will be used to cache the results of the loader.
   */
  cacheDirectory?: string | boolean
  /**
   * Can be set to a custom value to force cache busting if the identifier changes.
   */
  cacheIdentifier?: string
  /**
   * When set, each Babel transform output will be compressed with Gzip.
   */
  cacheCompression?: boolean
  /**
   * The path of a module that exports a custom callback.
   */
  customize?: string | null
  /**
   * Takes an array of context function names. E.g.
   */
  metadataSubscribers?: string[]
}

type OneOrMany<T> = T | T[]
export type ConfigChainWithContext<T, Ctx> = OneOrMany<
  T | ((config: T, ctx: Ctx) => T | void)
>

export interface PresetTypescriptOptions {
  ignoreExtensions?: boolean
  allowDeclareFields?: boolean
  allowNamespaces?: boolean
  disallowAmbiguousJSXLike?: boolean
  jsxPragma?: string
  jsxPragmaFrag?: string
  onlyRemoveTypeImports?: boolean
  optimizeConstEnums?: boolean
  rewriteImportExtensions?: boolean

  allExtensions?: boolean
  isTSX?: boolean
}

export type BabelConfigUtils = {
  addPlugins: (plugins: BabelPlugin[]) => void
  addPresets: (presets: BabelPlugin[]) => void
  removePlugins: (plugins: string | string[]) => void
  removePresets: (presets: string | string[]) => void
  modifyPresetTypescriptOptions: (options: PresetTypescriptOptions) => void
  modifyPluginOptions: (
    pluginName: string,
    options: Record<string, any>,
  ) => void
  isWebWorker?: boolean
  isServer?: boolean
}

export interface IExtraRspackOpts {
  extraSwcPlugins?: ExtraSwcPlugins
  modifySwcLoaderOptions?: ModifySwcLoaderOptions
}
