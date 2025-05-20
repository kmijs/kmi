import type { BabelPlugin } from '@kmijs/bundler-compiled'
import type { KmiTarget } from '@kmijs/bundler-shared'
import type {
  Application,
  RequestHandler,
} from '@kmijs/bundler-shared/compiled/express'
import type {
  Compiler,
  Configuration,
  MultiCompiler,
} from '@kmijs/bundler-shared/rspack'
import type Config from '@kmijs/bundler-shared/rspack-chain'
import type { Env, IUserConfig } from '../types'

export interface IBaseConfigOpts<U extends IUserConfig = IUserConfig> {
  cwd: string
  rootDir?: string
  entry: Record<string, string>
  config: U
  babelPreset?: BabelPlugin[]
  beforeBabelPlugins?: BabelPlugin[]
  beforeBabelPresets?: BabelPlugin[]
  extraBabelPlugins?: BabelPlugin[]
  extraBabelPresets?: BabelPlugin[]
  disableCopy?: boolean
  cache?: any
  pkg?: any
  chainWebpack?: (config: any, opts: any) => void
  modifyWebpackConfig?: (config: any) => any
  /**
   * onBeforeCreateCompiler 是在创建底层 Compiler 实例前触发的回调函数
   * 你可以通过 bundlerConfigs 参数获取到 Rspack 配置数组，数组中可能包含一份或多份 Rspack(Webpack) 配置，这取决于是否配置了多个 environments。
   * @param args
   * @returns
   */
  onBeforeCreateCompiler?: (...args: any[]) => void
  /**
   * onAfterCreateCompiler 是在创建底层 Compiler 实例后触发的回调函数
   * 你可以通过 compiler 参数获取到 Compiler 实例对象
   * @param args
   * @returns
   */
  onAfterCreateCompiler?: (...args: any[]) => void
  /**
   * 构建目标
   * @default 'web'
   * web: 浏览器
   * node: 服务端
   * web-worker: 浏览器 worker
   */
  target?: KmiTarget
}

export interface IBaseServerOpts {
  onDevCompileDone?: (opts: {
    stats: any
    isFirstCompile: boolean
    time: number
  }) => void
  onProgress?: ({ progresses }: { progresses: any[] }) => void
  onAfterStartDevServer?: (opts: {
    protocol: string
    port: number
    host: string
  }) => Promise<void>
  onBeforeMiddleware?: (app: Application) => void
  beforeMiddlewares?: RequestHandler[]
  afterMiddlewares?: RequestHandler[]
  port?: number
  host?: string
  ip?: string
  hmr: boolean
}

export interface IDevOpts<U extends IUserConfig = IUserConfig>
  extends IBaseConfigOpts<U>,
    Omit<IBaseServerOpts, 'hmr'> {}

export interface IBuildOpts<U extends IUserConfig = IUserConfig>
  extends IBaseConfigOpts<U> {
  onBuildComplete?: (...args: any[]) => void
  clean?: boolean
  watch?: boolean
}

export type BundlerType = 'webpack' | 'rspack'

export interface IBaseBundlerConfigOpts<U extends IUserConfig = IUserConfig> {
  cwd: string
  rootDir?: string
  env: Env
  entry: Record<string, string>
  extraBabelPresets?: BabelPlugin[]
  extraBabelPlugins?: BabelPlugin[]
  extraBabelIncludes?: Array<string | RegExp>
  babelPreset?: BabelPlugin[]
  chainWebpack?: (config: Config, opts: any) => void
  modifyWebpackConfig?: (config: Configuration, opts: any) => Configuration
  hash?: boolean
  hmr?: boolean
  staticPathPrefix?: string
  userConfig: U
  analyze?: any
  name?: string
  cache?: {
    absNodeModulesPath?: string
    buildDependencies?: string[]
    cacheDirectory?: string
  }
  pkg?: Record<string, any>
  disableCopy?: boolean
  host?: string
  port?: number
  environment?: string
  /**
   * onBeforeCreateCompiler 是在创建底层 Compiler 实例前触发的回调函数
   * 你可以通过 bundlerConfigs 参数获取到 Rspack 配置数组，数组中可能包含一份或多份 Rspack(Webpack) 配置，这取决于是否配置了多个 environments。
   * @param args
   * @returns
   */
  onBeforeCreateCompiler?: (...args: any[]) => void
  /**
   * onAfterCreateCompiler 是在创建底层 Compiler 实例后触发的回调函数
   * 你可以通过 compiler 参数获取到 Compiler 实例对象
   * @param args
   * @returns
   */
  onAfterCreateCompiler?: (...args: any[]) => void
  /**
   * 构建目标
   * @default 'web'
   * web: 浏览器
   * node: 服务端
   * web-worker: 浏览器 worker
   */
  target: KmiTarget
}

export interface IBaseCreateServerOpts<U extends IUserConfig = IUserConfig>
  extends Omit<IBaseBundlerConfigOpts<U>, 'hmr'>,
    IBaseServerOpts {
  bundlerConfigs: Configuration | Configuration[]
  bundlerType: BundlerType
  createCompiler: (opts: any) => Compiler | MultiCompiler
}
