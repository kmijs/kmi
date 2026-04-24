import type { BabelPlugin } from '@kmijs/bundler-compiled'
import type { KmiTarget } from '@kmijs/bundler-shared'
import type { Configuration } from '@kmijs/bundler-shared/rspack'
import { RspackChain } from '@kmijs/bundler-shared/rspack-chain'
import { DEFAULT_BROWSER_TARGETS } from '@kmijs/shared'
import { addSharedConfig } from '../config'
import type { Bundler, Env, IUserConfig } from '../types'
import { getBrowsersList } from '../utils/browsersList'
import type { BundlerType, IBaseBundlerConfigOpts } from './types'

export interface IBaseBundlerApplyOpts<U extends IUserConfig> {
  name: string
  config: RspackChain
  cwd: string
  env: Env
  babelPreset?: BabelPlugin[]
  extraBabelPlugins: BabelPlugin[]
  extraBabelPresets: BabelPlugin[]
  extraBabelIncludes: (string | RegExp)[]
  host?: string
  port?: number
  browsers: string[]
  useHash: boolean
  staticPathPrefix: string
  userConfig: U
  target: KmiTarget
}

export abstract class BaseBundlerConfig<
  U extends IUserConfig = IUserConfig,
  A extends IBaseBundlerApplyOpts<U> = IBaseBundlerApplyOpts<U>,
  O extends IBaseBundlerConfigOpts<U> = IBaseBundlerConfigOpts<U>,
> {
  protected config: RspackChain
  protected userConfig: U
  protected useHash: boolean
  protected bundlerType: BundlerType
  protected applyOpts: A

  /**
   * 当前 bundler 实例
   * rspack 和 webpack 的实例
   */
  protected bundler: any

  /**
   * 浏览器支持列表
   */
  protected browsers: string[]

  constructor(
    protected opts: O,
    bundlerType: BundlerType,
    bundler: any,
  ) {
    this.config = new RspackChain()
    this.userConfig = opts.userConfig as U
    this.bundlerType = bundlerType
    this.bundler = bundler
    this.useHash = !!(opts.hash || this.userConfig.hash)
    this.userConfig.targets ??= DEFAULT_BROWSER_TARGETS
    this.browsers = getBrowsersList({
      targets: this.userConfig.targets!,
    })
    this.applyOpts = this.prepareApplyOpts()
  }

  protected prepareApplyOpts(): A {
    return {
      name: this.opts.name,
      config: this.config,
      userConfig: this.userConfig,
      cwd: this.opts.cwd,
      env: this.opts.env,
      babelPreset: this.opts.babelPreset,
      extraBabelPlugins: this.opts.extraBabelPlugins || [],
      extraBabelPresets: this.opts.extraBabelPresets || [],
      extraBabelIncludes: this.opts.extraBabelIncludes || [],
      browsers: this.browsers,
      useHash: this.useHash,
      staticPathPrefix: this.opts.staticPathPrefix ?? 'static/',
      port: this.opts.port,
      host: this.opts.host,
      target: this.opts.target,
    } as A
  }

  /**
   * 获取插件
   */
  protected abstract getPlugins(): Bundler
  /**
   * 在获取配置之前执行的钩子
   */
  protected applyBeforeConfigHooks(): Promise<void> | void {}
  /**
   * 添加规则
   */
  protected abstract addRules(): Promise<void>
  /**
   * 添加插件
   */
  protected abstract addPlugins(): Promise<void>
  /**
   * 在获取配置之后执行的钩子
   */
  protected applyAfterConfigHooks(): Promise<void> | void {}

  public async getConfig(): Promise<Configuration> {
    await this.applyBeforeConfigHooks()

    addSharedConfig({
      name: this.opts.name || 'kmi',
      cwd: this.opts.cwd,
      env: this.opts.env,
      bundler: this.getPlugins(),
      config: this.config,
      userConfig: this.userConfig,
      bundlerType: this.bundlerType,
      useHash: this.useHash,
      staticPathPrefix: this.applyOpts.staticPathPrefix,
      entry: this.opts.entry,
      hmr: this.opts.hmr,
      disableCopy: this.opts.disableCopy,
      browsers: this.applyOpts.browsers,
      target: this.opts.target,
    })

    await this.addRules()
    await this.addPlugins()
    await this.applyAfterConfigHooks()

    const chainConfigOpts = {
      env: this.opts.env,
      webpack: this.bundler,
      environment: this.opts.environment,
      isServer: this.opts.target === 'node',
      isWebWorker: this.opts.target === 'web-worker',
      target: this.opts.target,
      ...(this.bundlerType === 'rspack' ? { rspack: this.bundler } : {}),
    }

    // Compatibility layer for ecosystem plugins that still assume webpack-chain APIs.
    // In kmi v2+ we use rspack-chain as the config carrier for both webpack/rspack flows.
    // Some plugins (e.g. qiankun slave) call output.libraryTarget(), which was migrated to
    // output.library.type in webpack5/rspack.
    if (this.bundlerType === 'rspack') {
      const output: any = (this.config as any)?.output
      if (output) {
        const normalizeLibrary = (value: any) => {
          if (!value) return {}
          // webpack-chain historically allows `output.library(name: string)`
          // webpack5/rspack prefer object form: { name, type, export, ... }
          if (typeof value === 'string') return { name: value }
          if (typeof value === 'object') return value
          return {}
        }
        const getLibrary = () => {
          if (typeof output.get === 'function')
            return normalizeLibrary(output.get('library'))
          return {}
        }
        const setLibrary = (patch: Record<string, any>) => {
          const current = getLibrary()
          const next = { ...(current || {}), ...(patch || {}) }
          if (typeof output.library === 'function') {
            output.library(next)
          } else if (typeof output.set === 'function') {
            output.set('library', next)
          }
        }

        // Make `output.library('name')` order-independent with `libraryTarget()`.
        // Some plugins call libraryTarget() first, then library(name), and the later
        // string form would overwrite the object form. We normalize string -> { name }.
        if (
          typeof output.library === 'function' &&
          !output.__kmiPatchedLibrary
        ) {
          const originalLibrary = output.library.bind(output)
          output.library = (value: any) => {
            if (typeof value === 'string') {
              setLibrary({ name: value })
              return output
            }
            return originalLibrary(value)
          }
          output.__kmiPatchedLibrary = true
        }

        if (typeof output.libraryTarget !== 'function') {
          output.libraryTarget = (type: string) => {
            setLibrary({ type })
            return output
          }
        }
        if (typeof output.libraryExport !== 'function') {
          output.libraryExport = (exportName: any) => {
            setLibrary({ export: exportName })
            return output
          }
        }
        if (typeof output.umdNamedDefine !== 'function') {
          output.umdNamedDefine = (umdNamedDefine: boolean) => {
            setLibrary({ umdNamedDefine })
            return output
          }
        }
        if (typeof output.auxiliaryComment !== 'function') {
          output.auxiliaryComment = (auxiliaryComment: any) => {
            setLibrary({ auxiliaryComment })
            return output
          }
        }
      }
    }

    if (this.opts.chainWebpack) {
      await this.opts.chainWebpack(this.config, chainConfigOpts)
    }

    if (this.userConfig.chainWebpack) {
      await this.userConfig.chainWebpack(this.config, chainConfigOpts)
    }

    let bundlerConfig = this.config.toConfig() as Configuration
    if (this.opts.modifyWebpackConfig) {
      bundlerConfig = await this.opts.modifyWebpackConfig(
        bundlerConfig,
        chainConfigOpts,
      )
    }
    return bundlerConfig
  }
}
