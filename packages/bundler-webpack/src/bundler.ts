import path from 'node:path'
import {
  BaseBundler,
  Env,
  type IBuildOpts as IBaseBuildOpts,
  type IBaseBundlerConfigOpts,
  type IBaseCreateServerOpts,
  type IDevOpts as IBaseDevOpts,
  createBaseServer,
} from '@kmijs/bundler-shared-config'
import webpack from '../compiled/webpack'
import type { IConfig } from './types'

type IOpts = IBaseBundlerConfigOpts<IConfig> & {
  // dev 模式进度条
  onProgress?: ({ progresses }: { progresses: any[] }) => void
}

export type IBuildOpts = IBaseBuildOpts<IConfig>

export type IDevOpts = IBaseDevOpts<IConfig>

export class WebpackBundler extends BaseBundler<IConfig, IOpts> {
  constructor() {
    super('webpack')
  }

  public normalizeConfigOptions(opts: IBaseBuildOpts<IConfig> & { env: Env }) {
    const cacheDirectoryPath = path.resolve(
      opts.rootDir || opts.cwd,
      opts.config.cacheDirectoryPath || 'node_modules/.cache',
    )

    return {
      ...super.normalizeConfigOptions(opts),
      cache: opts.cache
        ? {
            ...opts.cache,
            cacheDirectory: path.join(cacheDirectoryPath, 'bundler-webpack'),
          }
        : undefined,
    }
  }

  // @ts-expect-error
  async generateBundlerConfigs(opts: IOpts) {
    const configModule = await import('./config/config.js')
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

    return [bundlerConfig]
  }

  // @ts-expect-error
  createCompiler(opts: IOpts & { bundlerConfigs: webpack.Configuration[] }) {
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
          new webpack.ProgressPlugin((percent, msg, ...details) => {
            progress.percent = percent
            progress.status = msg
            ;(progress.details as string[]) = details
            opts.onProgress!({ progresses })
          }),
        )
      })
    }

    const compiler = webpack(bundlerConfigs)
    return compiler
  }

  async createServer(opts: IBaseCreateServerOpts<IConfig>): Promise<void> {
    await createBaseServer({
      ...opts,
    })
  }
}
