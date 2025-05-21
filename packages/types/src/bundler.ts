import type { Compiler, Configuration, rspack } from '@kmijs/bundler-rspack'
import type { ChainIdentifier, KmiTarget } from '@kmijs/bundler-shared'
import type { merge } from '@kmijs/shared/compiled/webpack-merge'

export type { Configuration, Compiler } from '@kmijs/bundler-rspack'

export enum Env {
  development = 'development',
  production = 'production',
  test = 'test',
}

export enum BundlerTypeEnum {
  webpack = 'webpack',
  rspack = 'rspack',
}

export type BundlerType = keyof typeof BundlerTypeEnum

/** T[] => T */
type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never

export type BundlerRule = GetElementType<
  NonNullable<NonNullable<Configuration['module']>['rules']>
>

export type BasicChainUtils = {
  rspack?: typeof rspack
  webpack: typeof rspack
  env: Env
  environment?: string
  isServer: boolean
  isWebWorker: boolean
  target: KmiTarget
}

export interface ModifyChainUtils extends BasicChainUtils {
  isDev: boolean
  isProd: boolean
  CHAIN_ID: ChainIdentifier
  isServer: boolean
  bundler: {
    BannerPlugin: BundlerPluginInstance
    DefinePlugin: BundlerPluginInstance
    IgnorePlugin: BundlerPluginInstance
    ProvidePlugin: BundlerPluginInstance
    HotModuleReplacementPlugin: BundlerPluginInstance
  }
}

export interface BundlerPluginInstance {
  [index: string]: any
  apply: (compiler: any) => void
}

export type ModifyBundlerConfigUtils = Omit<ModifyChainUtils, 'CHAIN_ID'> & {
  addRules: (rules: BundlerRule | BundlerRule[]) => void
  appendRules: (rules: BundlerRule | BundlerRule[]) => void
  prependPlugins: (
    plugins: BundlerPluginInstance | BundlerPluginInstance[],
  ) => void
  appendPlugins: (
    plugins: BundlerPluginInstance | BundlerPluginInstance[],
  ) => void
  removePlugin: (pluginName: string) => void
  mergeConfig: typeof merge
}

export type BundlerConfig =
  | Omit<Configuration, 'entry'>
  | ((
      memo: Omit<Configuration, 'entry'>,
      utils: ModifyBundlerConfigUtils,
    ) => Configuration | Promise<Configuration>)

export type IOnBeforeCreateCompilerOpts = {
  bundlerConfigs: Configuration[]
  env: Env
}

export type IOnAfterCreateCompilerOpts = {
  bundlerConfigs: Configuration[]
  env: Env
  compiler: Compiler
}
