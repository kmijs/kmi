import type {
  BabelPlugin,
  BundleAnalyzerOptions,
  CSSMinifier,
  JSMinifier,
  ManifestOptions,
} from '@kmijs/bundler-compiled'
import type {
  HttpsServerOptions,
  KmiTarget,
  ProxyOptions,
} from '@kmijs/bundler-shared'
import type {
  Configuration,
  LightningcssLoaderOptions,
  LoaderContext,
  RuleSetCondition,
  rspack,
} from '@kmijs/bundler-shared/rspack'
import type Config from '@kmijs/bundler-shared/rspack-chain'

export interface BundlerPluginInstance {
  [index: string]: any
  apply: (compiler: any) => void
}

export interface Bundler {
  BannerPlugin: BundlerPluginInstance
  DefinePlugin: BundlerPluginInstance
  IgnorePlugin: BundlerPluginInstance
  ProvidePlugin: BundlerPluginInstance
  HotModuleReplacementPlugin: BundlerPluginInstance
  CopyPlugin: BundlerPluginInstance
  ManifestPlugin: BundlerPluginInstance
  TsCheckerPlugin: BundlerPluginInstance
  CssExtractPlugin: BundlerPluginInstance
  RuntimePublicPathPlugin: BundlerPluginInstance
}

export enum Env {
  development = 'development',
  production = 'production',
}

type WebpackConfig = Required<Configuration>

export interface ICopy {
  from: string
  to: string
}

type ModifyWebpackOpts = {
  env: Env
  webpack?: typeof rspack
  rspack?: typeof rspack
}

export type IChainWebpack = (config: Config, opts: ModifyWebpackOpts) => void
export type IModifyWebpackConfig = (
  config: Configuration,
  opts: ModifyWebpackOpts,
) => Configuration

export interface IUserConfig {
  define?: { [key: string]: any }
  https?: HttpsServerOptions
  extraBabelPlugins?: BabelPlugin[]
  extraBabelPresets?: BabelPlugin[]
  extraBabelIncludes?: Array<string | RegExp>
  hash?: boolean
  jsMinifier?: `${JSMinifier}`
  jsMinifierOptions?: { [key: string]: any }
  proxy?: { [key: string]: ProxyOptions } | ProxyOptions[]
  styleLoader?: { [key: string]: any }
  targets?: { [key: string]: any }
  writeToDisk?: boolean
  esbuildMinifyIIFE?: boolean
  base?: string
  devtool?: Config.DevTool
  alias?: Record<string, string>
  externals?: WebpackConfig['externals']
  javascriptExportsPresence?: boolean
  outputPath?: string | OutputPathConfig
  publicPath?: string
  esm?: { [key: string]: any }
  inlineLimit?: number | InlineLimitConfig
  mdx?: Record<string, any>
  ignoreMomentLocale?: boolean
  copy?: ICopy[] | string[]
  analyze?: BundleAnalyzerOptions
  manifest?: Partial<ManifestOptions>
  // TODO 改成真正的类型
  forkTSChecker?: Record<string, any>
  /**
   *  设置构建产物的名称
   *  在生产模式构建后，Kmi 会自动在文件名中间添加 hash 值，如果不需要添加，可以将 hash 设置为 false 来禁用该行为。
   */
  filename?: FilenameConfig
  /**
   * 用于控制是否输出图片、字体、音频、视频等静态资源。
   */
  emitAssets?: boolean
  /**
   * 包含应该被视为静态资源的额外文件。
   * @default undefined
   */
  assetsInclude?: RuleSetCondition

  /**
   * 用户 启用 rspack 相关能力, 这里不是 rspack 配置
   */
  rspack?: Record<string, any>

  lightningcssLoader?: boolean | LightningcssLoaderOptions

  /**
   * less loader 主题配置
   */
  theme?: Record<string, any>

  lessLoader?:
    | Record<string, any>
    | ((loaderContext: LoaderContext) => Record<string, any>)
  sassLoader?: Record<string, any>
  stylusLoader?: Record<string, any>
  cssExtractLoader?: Record<string, any>
  cssLoaderModules?: Record<string, any>
  cssLoader?: Record<string, any>
  normalCSSLoaderModules?: Record<string, any>
  extraPostCSSPlugins?: any[]
  /**
   * 是否启用 css modules
   */
  autoCSSModules?: boolean
  autoprefixer?: Record<string, any>
  postcssLoader?: Record<string, any>
  /**
   * 按照顺序解析模块，例如 require('./index')，会依次尝试解析 './index.js'、'./index.json'
   */
  extensions?: string[]
  /**
   * 压缩 css 的工具
   */
  cssMinifier?: `${CSSMinifier}`
  /**
   * 压缩 css 的工具配置
   */
  cssMinifierOptions?: Record<string, any>
  /**
   * 启用运行时 publicPath，开启后会使用 window.publicPath 作为资源动态加载的起始路径
   */
  runtimePublicPath?: Record<string, any> | boolean
  /**
   * 用户提供的链式配置
   */
  chainWebpack?: IChainWebpack
  /**
   * 用户提供的配置修改器
   */
  modifyWebpackConfig?: IModifyWebpackConfig

  /**
   * 开发服务器配置
   */
  server?: {
    open?: string | string[] | boolean
    host?: string
    port?: number
  }
}

export interface SharedConfigOptions {
  name: string
  bundler: Bundler
  cwd: string
  env: Env
  config: Config
  /**
   * 用户配置
   */
  userConfig: IUserConfig
  bundlerType: 'webpack' | 'rspack'
  /**
   * 资源是否带 hash 后缀
   */
  useHash: boolean
  /**
   * 静态资源前缀
   */
  staticPathPrefix: string
  /**
   * 入口 entry
   */
  entry: Record<string, string>
  /**
   * 是否启用热更新
   */
  hmr?: boolean
  /**
   * 禁用文件 copy
   */
  disableCopy?: boolean

  /**
   * 浏览器兼容性配置
   */
  browsers: string[]

  /**
   * 构建目标
   * @default 'web'
   * web: 浏览器
   * node: 服务端
   * web-worker: 浏览器 worker
   */
  target: KmiTarget
}

export type InlineLimitConfig = {
  /**
   * SVG 图片的 data URI 限制大小
   * @default 4096
   */
  svg?: number
  /**
   * 字体文件的 data URI 限制大小
   * @default 4096
   */
  font?: number
  /**
   * 非 SVG 图片的 data URI 限制大小
   * @default 4096
   */
  image?: number
  /**
   * 媒体资源(如视频)的 data URI 限制大小
   * @default 0
   */
  media?: number
  /**
   * 其他静态资源的 data URI 限制大小
   * @default 4096
   */
  assets?: number
}

export type OutputPathConfig = {
  /**
   * 所有文件的根目录
   * @default 'dist'
   **/
  root?: string
  /**
   * JavaScript 文件的输出目录
   * @default 'static/js'
   */
  js?: string
  /**
   * CSS 文件的输出目录
   * @default 'static/css'
   */
  css?: string
  /**
   * SVG 图片的输出目录
   * @default 'static/svg'
   */
  svg?: string
  /**
   * 字体文件的输出目录
   * @default 'static/font'
   */
  font?: string
  /**
   * Wasm 文件的输出目录
   * @default 'static/wasm'
   */
  wasm?: string
  /**
   * 非 SVG 图片的输出目录
   * @default 'static/image'
   */
  image?: string
  /**
   * 媒体资源的输出目录，如视频等
   * @default 'static/media'
   */
  media?: string
  /**
   * 除了上述资源(图片、SVG、字体、HTML、WASM等)以外的资源输出目录
   * @default 'static/assets'
   */
  assets?: string
}

export type FilenameConfig = {
  /**
   * JavaScript 文件的命名规则
   * @default
   * - dev: '[name].js'
   * - prod: '[name].[contenthash:8].js'
   */
  js?: NonNullable<Configuration['output']>['filename']
  /**
   * 异步 JavaScript 文件的命名规则
   * @default
   * - dev: '[name].async.js'
   * - prod: '[name].[contenthash:8].async.js'
   */
  jsAsync?: NonNullable<Configuration['output']>['filename']
  /**
   * CSS 文件的命名规则
   * @default
   * - dev: '[name].css'
   * - prod: '[name].[contenthash:8].css'
   */
  css?: NonNullable<Configuration['output']>['cssFilename']
  /**
   * 异步 CSS 文件的命名规则
   * @default
   * - dev: '[name].async.css'
   * - prod: '[name].[contenthash:8].async.css'
   */
  cssAsync?: NonNullable<Configuration['output']>['cssFilename']
  /**
   * SVG 图片的命名规则
   * @default '[name].[contenthash:8].svg'
   */
  svg?: string
  /**
   * HTML 文件的命名规则
   * @default `[name].html`
   */
  html?: string
  /**
   * 字体文件的命名规则
   * @default '[name].[contenthash:8][ext]'
   */
  font?: string
  /**
   * 非 SVG 图片的命名规则
   * @default '[name].[contenthash:8][ext]'
   */
  image?: string
  /**
   * 媒体资源的命名规则，如视频等
   * @default '[name].[contenthash:8][ext]'
   */
  media?: string
  /**
   * 其他资源的命名规则，除了上述资源(图片、SVG、字体、HTML、WASM等)以外的文件
   * @default '[name].[contenthash:8][ext]'
   */
  assets?: string
}
