// 4kb 4096 字节
export const DEFAULT_INLINE_LIMIT = 4096

export const DEFAULT_OUTPUT_PATH = 'dist'

export const CHAIN_ID = {
  /** Predefined rules */
  RULE: {
    /** Rule for src  /\.(js|mjs|cjs)$/ */
    JS_SRC: 'src',
    /** Rule for jsx-ts-tsx  /\.(jsx|ts|tsx */
    JSX_TS_TSX: 'jsx-ts-tsx',
    /** Rule for extra-src  /\.(js|mjs|cjs)$/ 配置 extraBabelIncludes 中匹配的文件 */
    JS_EXTRA_SRC: 'extra-src',

    // TODO 未使用
    /** Rule for Vue */
    VUE: 'vue',

    /** Rule for svg */
    SVG: 'svg',
    /** Rule for pug */
    PUG: 'pug',
    /** Rule for wasm */
    WASM: 'wasm',
    /** Rule for fonts */
    FONT: 'font',
    /** Rule for images */
    IMAGE: 'image',
    /** Rule for media */
    MEDIA: 'media',
    /** Rule for additional assets */
    ADDITIONAL_ASSETS: 'additional-assets',
  },
  /** Predefined rule groups */
  ONE_OF: {
    SVG: 'svg',
    SVG_URL: 'svg-asset-url',
    SVG_ASSET: 'svg-asset',
    SVG_REACT: 'svg-react',
    SVG_INLINE: 'svg-asset-inline',
  },
  USE: {
    /** swc-loader */
    SWC: 'swc',
    /** babel-loader */
    BABEL: 'babel',
    /** svgr-loader */
    SVGR: 'svgr',
    /** url-loader */
    URL: 'url',
  },
  /** Predefined plugins */
  PLUGIN: {
    /** node-polyfill-webpack-plugin */
    NODE_POLYFILL: 'node-polyfill',
    /** CssExtractPlugin */
    MINI_CSS_EXTRACT: 'mini-css-extract-plugin',
    /** ForkTSCheckerPlugin */
    FORK_TS_CHECKER: 'fork-ts-checker-plugin',
    /** @umijs/case-sensitive-paths-webpack-plugin  */
    CASE_SENSITIVE_PATHS: 'caseSensitivePaths',
    /** webpack-bundle-analyzer */
    BUNDLE_ANALYZER: 'webpack-bundle-analyzer',
    /** ManifestPlugin */
    MANIFEST: 'manifest-plugin',
    /** ignore-moment-locale */
    IGNORE_MOMENT_LOCALE: 'ignore-moment-locale',
    /** copy-webpack-plugin */
    COPY: 'copy',
    /** HotModuleReplacementPlugin */
    HMR: 'hmr',
    /** ReactFastRefreshPlugin */
    REACT_FAST_REFRESH: 'fastRefresh',
    /** EsbuildMinifyFix */
    ESBUILD_MINIFY_FIX: 'EsbuildMinifyFix',
    /** RuntimePublicPathPlugin */
    RUNTIME_PUBLIC_PATH: 'runtimePublicPath',
  },

  /** Predefined minimizers */
  MINIMIZER: {
    /** SwcJsMinimizerRspackPlugin or terser-webpack-plugin */
    JS: 'js',
    /** LightningCssMinimizerRspackPlugin or css-minimizer-webpack-plugin */
    CSS: 'css',
  },
} as const

export type ChainIdentifier = typeof CHAIN_ID
