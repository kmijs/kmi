import type {
  Compiler,
  MultiCompiler,
  MultiStats,
  Stats,
} from '@kmijs/bundler-shared/rspack'
import type { Configuration } from '@kmijs/bundler-shared/rspack'
import { logger } from '@kmijs/shared'
import { Env, type IUserConfig } from '../types'
import { esbuildCompressErrorHelper } from '../utils/esbuildCompressErrorHelper'
import type {
  BundlerType,
  IBaseBundlerConfigOpts,
  IBaseConfigOpts,
  IBaseCreateServerOpts,
  IBuildOpts,
  IDevOpts,
} from './types'

export abstract class BaseBundler<
  U extends IUserConfig,
  BC extends IBaseBundlerConfigOpts<U>,
> {
  constructor(protected bundlerType: BundlerType) {}
  protected abstract createCompiler(
    opts: BC & {
      bundlerConfigs: Configuration[]
    },
  ): Compiler | MultiCompiler

  protected abstract generateBundlerConfigs(opts: BC): Promise<Configuration[]>

  public normalizeConfigOptions<B extends IBaseConfigOpts<U>>(
    opts: B & { env: Env },
  ): BC {
    const { config, ...rest } = opts
    // 不能重叠的部分,
    return {
      ...rest,
      target: opts.target ?? 'web',
      cwd: opts.cwd,
      rootDir: opts.rootDir,
      env: opts.env,
      entry: opts.entry,
      userConfig: opts.config,
      analyze: process.env.ANALYZE,
      babelPreset: opts.babelPreset,
      extraBabelPlugins: [
        ...(opts.beforeBabelPlugins || []),
        ...(opts.extraBabelPlugins || []),
      ],
      extraBabelPresets: [
        ...(opts.beforeBabelPresets || []),
        ...(opts.extraBabelPresets || []),
      ],
      extraBabelIncludes: opts.config.extraBabelIncludes,
      chainWebpack: opts.chainWebpack,
      modifyWebpackConfig: opts.modifyWebpackConfig,
      pkg: opts.pkg,
      disableCopy: opts.disableCopy,
    } as unknown as BC
  }

  public async build(opts: IBuildOpts<U>): Promise<Stats | MultiStats> {
    logger.verbose('[BaseBundler] build opts', opts)
    const buildOptions = this.normalizeConfigOptions<IBuildOpts<U>>({
      ...opts,
      env: Env.production,
    })

    const bundlerConfigs = await this.generateBundlerConfigs(buildOptions)
    let isFirstCompile = true

    return new Promise((resolve, reject) => {
      const compiler = this.createCompiler({
        ...buildOptions,
        bundlerConfigs,
      })
      let closeWatching: any

      const handler = async (err: Error | null, stats: any) => {
        // generate valid error from normal error and stats error
        const validErr =
          err ||
          (stats?.hasErrors()
            ? new Error(stats!.toString('errors-only'))
            : null)

        await opts.onBuildComplete?.({
          err: validErr,
          stats,
          isFirstCompile,
          time: stats ? stats.endTime - stats.startTime : null,
          isWatch: Boolean(opts.watch),
          ...(opts.watch ? { close: closeWatching } : {}),
        })

        isFirstCompile = false

        if (validErr) {
          // try to catch esbuild minify error to output  friendly error message
          stats?.hasErrors() && esbuildCompressErrorHelper(validErr.toString())
          reject(validErr)
        } else {
          resolve(stats!)
        }

        // close compiler after normal build
        if (!opts.watch) compiler.close(() => {})
      }

      // handle watch mode
      if (opts.watch) {
        const watching = compiler.watch({}, handler)
        closeWatching = watching.close.bind(watching)
      } else {
        compiler.run(handler)
      }
    })
  }

  protected abstract createServer(opts: IBaseCreateServerOpts<U>): Promise<void>

  public async dev(opts: IDevOpts<U>) {
    logger.verbose('[BaseBundler] dev opts', opts)
    const normalizeOpts = this.normalizeConfigOptions<IDevOpts<U>>({
      ...opts,
      env: Env.development,
    })

    const devOptions = {
      ...normalizeOpts,
      hmr: process.env.HMR !== 'none',
      port: opts.port,
      host: opts.host,
    }

    const bundlerConfigs = await this.generateBundlerConfigs(devOptions)
    logger.verbose('[BaseBundler] dev bundlerConfigs', bundlerConfigs)

    await this.createServer({
      ...devOptions,
      bundlerConfigs,
      bundlerType: this.bundlerType,
      createCompiler: this.createCompiler,
    })
  }
}
