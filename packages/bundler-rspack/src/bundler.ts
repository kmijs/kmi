import path from 'node:path'
import type { KmiTarget } from '@kmijs/bundler-shared'
import {
  BaseBundler,
  Env,
  type IBuildOpts as IBaseBuildOpts,
  type IBaseBundlerConfigOpts,
  type IBaseCreateServerOpts,
  type IDevOpts as IBaseDevOpts,
  createBaseServer,
} from '@kmijs/bundler-shared-config'
import {
  type Compiler,
  type Configuration,
  type MultiCompiler,
  rspack,
} from '@kmijs/bundler-shared/rspack'
import { webpackMerge } from '@kmijs/shared'
import type { IConfig, IExtraRspackOpts } from './types'

interface IEnvironment {
  name: string
  targets?: Record<string, any>
  config?: IConfig
  outputPath?: string
  entry: Record<string, any>
  target: KmiTarget
}

type IOpts = IBaseBundlerConfigOpts<IConfig> &
  IExtraRspackOpts & {
    // dev 模式进度条
    onProgress?: ({ progresses }: { progresses: any[] }) => void
    environments?: IEnvironment[]
  }

export type IBuildOpts = IBaseBuildOpts<IConfig> & IExtraRspackOpts

export type IDevOpts = IBaseDevOpts<IConfig> & IExtraRspackOpts

export class RspackBundler extends BaseBundler<IConfig, IOpts> {
  constructor() {
    super('rspack')
  }

  async generateBundlerConfigs(opts: IOpts) {
    const configModule = await import('./config/config.js')
    const bundlerConfigs: Configuration[] = []
    const bundlerConfig = await configModule.getConfig(opts)
    if (opts.env === Env.development) {
      bundlerConfig.resolve!.alias ||= {}
      ;['@kmijs/shared/compiled/strip-ansi', 'react-error-overlay'].forEach(
        (dep) => {
          // @ts-ignore
          bundlerConfig.resolve!.alias[dep] = path.dirname(
            require.resolve(`${dep}/package.json`),
          )
        },
      )
    }

    bundlerConfigs.push(bundlerConfig)

    // 多环境配置
    if (opts.environments) {
      const pAll = opts.environments.map(async (environment) => {
        const isServer = environment.target === 'node'
        const environmentBundlerConfig = await configModule.getConfig({
          ...opts,
          hmr: isServer ? false : opts.hmr,
          entry: environment.entry,
          name: environment.name,
          environment: environment.name,
          userConfig: environment.config
            ? webpackMerge(opts.userConfig, environment.config)
            : opts.userConfig,
          target: environment.target,
        })
        bundlerConfigs.push(environmentBundlerConfig)
      })

      await Promise.all(pAll)
    }

    return bundlerConfigs
  }

  createCompiler(
    opts: IOpts & { bundlerConfigs: Configuration[] },
  ): Compiler | MultiCompiler {
    const { bundlerConfigs, env } = opts
    // 如果是 dev 模式 并且 配置了 onProgress
    if (env === Env.development && opts.onProgress) {
      bundlerConfigs.forEach((config) => {
        const progresses: any[] = []
        const progress = {
          percent: 0,
          status: 'waiting',
          details: [],
        }
        progresses.push(progress)
        config.plugins!.push(
          new rspack.ProgressPlugin((percent, msg, ...details) => {
            progress.percent = percent
            progress.status = msg
            ;(progress.details as string[]) = details
            opts.onProgress!({ progresses })
          }),
        )
      })
    }

    opts.onBeforeCreateCompiler?.({
      bundlerConfigs,
      env,
    })

    const isMultiCompiler = bundlerConfigs.length > 1
    const compiler = isMultiCompiler
      ? rspack(bundlerConfigs)
      : rspack(bundlerConfigs[0])

    opts.onAfterCreateCompiler?.({
      compiler,
      bundlerConfigs,
      env,
    })
    return compiler
  }

  async createServer(opts: IBaseCreateServerOpts<IConfig>): Promise<void> {
    await createBaseServer({
      ...opts,
    })
  }
}
