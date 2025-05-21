import type {
  BabelConfigUtils as RspacBabelConfigUtils,
  BabelLoaderOptions as RspackBabelLoaderOptions,
  SwcLoaderOptions,
} from '@kmijs/bundler-rspack'
import type { KmiTarget } from '@kmijs/bundler-shared'
import type RspackChain from '@kmijs/bundler-shared/rspack-chain'
import type { IAdd, IEvent, IModify } from '@umijs/core'
import type { IApi as IUmiApi } from 'umi'
import type { Env } from './bundler'
import type {
  BasicChainUtils,
  Configuration,
  IOnAfterCreateCompilerOpts,
  IOnBeforeCreateCompilerOpts,
  ModifyBundlerConfigUtils,
  ModifyChainUtils,
} from './bundler'

export interface IApi extends Omit<IUmiApi, 'chainWebpack'> {
  addExtraSwcPlugins: IAdd<null, Array<[string, any]>>
  modifySwcLoaderOptions: IModify<
    SwcLoaderOptions,
    {
      env: Env
      isServer: boolean
      isWebWorker: boolean
      target: KmiTarget
    }
  >
  modifyRspackBabelLoaderOptions: IModify<
    RspackBabelLoaderOptions,
    RspacBabelConfigUtils
  >
  modifyBundlerConfig: IModify<Configuration, ModifyBundlerConfigUtils>
  bundlerChain: IModify<RspackChain, ModifyChainUtils>
  onBeforeCreateCompiler: IEvent<IOnBeforeCreateCompilerOpts>
  onAfterCreateCompiler: IEvent<IOnAfterCreateCompilerOpts>
  chainWebpack: (fn: (memo: RspackChain, args: BasicChainUtils) => void) => void
  addBabelPresets: IAdd<null, any>
}
