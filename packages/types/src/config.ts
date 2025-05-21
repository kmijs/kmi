import type {
  BabelConfigUtils,
  BabelLoaderOptions,
  Configuration,
  IBundlerConfig,
} from '@kmijs/bundler-rspack'
import type Config from '@kmijs/bundler-shared/rspack-chain'
import type { BundlerConfig, ModifyChainUtils } from './bundler'

export type SplitChunks = Configuration extends {
  optimization?: {
    splitChunks?: infer P
  }
}
  ? P
  : never

export type CacheGroups = Configuration extends {
  optimization?: {
    splitChunks?:
      | {
          cacheGroups?: infer P
        }
      | false
  }
}
  ? P
  : never

export type CacheGroup = CacheGroups extends {
  [key: string]: infer P
}
  ? P
  : null

export type ForceSplitting = RegExp[] | Record<string, RegExp>

interface CodeSplitting {
  /**
   * - **bigVendors**: 大 vendors 方案，会将 async chunk 里的 node_modules 下的文件打包到一起，可以避免重复。同时缺点是
   *    - 单文件的尺寸过大
   *    - 毫无缓存效率可言
   * - **depPerChunk**: 和 bigVendors 类似，不同的是把依赖按 package name + version 进行拆分，算是解了 bigVendors 的尺寸和缓存效率问题。但同时带来的潜在问题是，可能导致请求较多。我的理解是，对于非大型项目来说其实还好，因为，
   *    - 单个页面的请求不会包含非常多的依赖
   *    - 基于 HTTP/2，几十个请求不算问题。但是，对于大型项目或巨型项目来说，需要考虑更合适的方案
   * - **granularChunks**: 在 bigVendors 和 depPerChunk 之间取了中间值，同时又能在缓存效率上有更好的利用。无特殊场景，建议用 granularChunks 策略。
   */
  jsStrategy: 'bigVendors' | 'depPerChunk' | 'granularChunks'
  jsStrategyOptions?: {
    /**
     * 需要优化的 package 列表
     */
    frameworkBundles?: string[]
  }
  /**
   * 自定义拆包配置, 此配置会和默认的拆包策略合并 (cacheGroups 配置也会合并)
   */
  override?: Exclude<SplitChunks, false>
  /**
   * 指定的模块强制拆分为一个独立的 chunk
   */
  forceSplitting?: ForceSplitting
}

type NoStringIndex<T> = {
  [K in keyof T as string extends K ? never : K]: T[K]
}

export interface IBaseConfig
  extends Omit<
    NoStringIndex<IBundlerConfig>,
    'cssMinifier' | 'jsMinifier' | 'alias' | 'bundler'
  > {
  rspack?: {
    /**
     * 启用 babel 编译 默认是 false
     */
    useBabel?: boolean
    /**
     * 启用 less worker 编译 默认是 true
     */
    enableLessWoker?: boolean
    /**
     * 启用懒编译
     */
    lazyCompilation?: Record<string, any> | boolean
    /**
     * 关闭不存在的导出或存在冲突的重导出时报错校验 默认是 false
     */
    javascriptExportsPresence?: boolean
    __babelLoaderOptions?: (
      ctx: BabelLoaderOptions,
      args: BabelConfigUtils,
    ) => void
    [key: string]: any
  }
  alias: Record<string, string>
  /**
   * 设置代码拆分
   */
  codeSplitting: CodeSplitting
  /**
   * 自定义 bundler (Webpack/Rspack) 配置项
   */
  bundler: BundlerConfig
  /**
   * 通过 rspack-chain 自定义 bundler (Webpack/Rspack) 配置项
   */
  bundlerChain: (
    memo: Config,
    args: ModifyChainUtils,
  ) => void | Config | Promise<void | Config>
}

type WithFalse<T> = {
  [P in keyof T]?: T[P] | false
}

export type IConfig = WithFalse<IBaseConfig>
