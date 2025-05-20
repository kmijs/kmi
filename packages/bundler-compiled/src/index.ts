import type { MangleOptions, ParseOptions, SourceMapOptions } from 'terser'
import type { CompressOptions, ECMA, FormatOptions } from './types/terser'

export interface TerserOptions {
  compress?: boolean | CompressOptions
  ecma?: ECMA
  enclose?: boolean | string
  ie8?: boolean
  keep_classnames?: boolean | RegExp
  keep_fnames?: boolean | RegExp
  mangle?: boolean | MangleOptions
  module?: boolean
  nameCache?: object
  format?: FormatOptions
  /** @deprecated */
  output?: FormatOptions
  parse?: ParseOptions
  safari10?: boolean
  sourceMap?: boolean | SourceMapOptions
  toplevel?: boolean
}

export type { BundleAnalyzerOptions } from './types/analyze'
export * from './types/bundler'
export * from './schema'
export * from './types/manifest'
export * from './prettyPrintEsBuildErrors'
export * from './constant'
