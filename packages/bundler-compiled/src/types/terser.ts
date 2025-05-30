import type {
  InlineFunctions,
  OutputQuoteStyle,
  SourceMapOptions,
} from 'terser'
export type ECMA = 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020

export interface CompressOptions {
  arguments?: boolean
  arrows?: boolean
  booleans_as_integers?: boolean
  booleans?: boolean
  collapse_vars?: boolean
  comparisons?: boolean
  computed_props?: boolean
  conditionals?: boolean
  dead_code?: boolean
  defaults?: boolean
  directives?: boolean
  drop_console?: boolean
  drop_debugger?: boolean
  ecma?: ECMA
  evaluate?: boolean
  expression?: boolean
  global_defs?: object
  hoist_funs?: boolean
  hoist_props?: boolean
  hoist_vars?: boolean
  ie8?: boolean
  if_return?: boolean
  inline?: boolean | InlineFunctions
  join_vars?: boolean
  keep_classnames?: boolean | RegExp
  keep_fargs?: boolean
  keep_fnames?: boolean | RegExp
  keep_infinity?: boolean
  loops?: boolean
  module?: boolean
  negate_iife?: boolean
  passes?: number
  properties?: boolean
  pure_funcs?: string[]
  pure_getters?: boolean | 'strict'
  reduce_funcs?: boolean
  reduce_vars?: boolean
  sequences?: boolean | number
  side_effects?: boolean
  switches?: boolean
  toplevel?: boolean
  top_retain?: null | string | string[] | RegExp
  typeofs?: boolean
  unsafe_arrows?: boolean
  unsafe?: boolean
  unsafe_comps?: boolean
  unsafe_Function?: boolean
  unsafe_math?: boolean
  unsafe_symbols?: boolean
  unsafe_methods?: boolean
  unsafe_proto?: boolean
  unsafe_regexp?: boolean
  unsafe_undefined?: boolean
  unused?: boolean
}

export interface FormatOptions {
  ascii_only?: boolean
  /** @deprecated Not implemented anymore */
  beautify?: boolean
  braces?: boolean
  comments?:
    | boolean
    | 'all'
    | 'some'
    | RegExp
    | ((
        node: any,
        comment: {
          value: string
          type: 'comment1' | 'comment2' | 'comment3' | 'comment4'
          pos: number
          line: number
          col: number
        },
      ) => boolean)
  ecma?: ECMA
  ie8?: boolean
  keep_numbers?: boolean
  indent_level?: number
  indent_start?: number
  inline_script?: boolean
  keep_quoted_props?: boolean
  max_line_len?: number | false
  preamble?: string
  preserve_annotations?: boolean
  quote_keys?: boolean
  quote_style?: OutputQuoteStyle
  safari10?: boolean
  semicolons?: boolean
  shebang?: boolean
  shorthand?: boolean
  source_map?: SourceMapOptions
  webkit?: boolean
  width?: number
  wrap_iife?: boolean
  wrap_func_args?: boolean
}
