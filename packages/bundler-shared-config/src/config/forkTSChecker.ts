import { CHAIN_ID } from '@kmijs/bundler-shared'
import { reduceConfigs } from '@kmijs/bundler-shared/compiled/reduce-configs'
import { deepmerge, logger, pathe } from '@kmijs/shared'
import type { SharedConfigOptions } from '../types'
import { Env } from '../types'

export function applyForkTSChecker(opts: SharedConfigOptions) {
  const { cwd, config, userConfig, bundler, env } = opts

  if (userConfig.forkTSChecker) {
    const NODE_MODULES_REGEX: RegExp = /[\\/]node_modules[\\/]/
    // use typescript of user project
    let typescriptPath: string
    try {
      typescriptPath = require.resolve('typescript', {
        paths: [cwd],
      })
    } catch (err) {
      logger.warn(
        '"typescript" is not found in current project, Type checker will not work.',
      )
      return
    }

    // TODO 支持传入 tsconfig 及 通过 useReference 判断是是否启用 build
    const defaultOptions = {
      async: env === Env.development,
      typescript: {
        configFile: pathe.join(cwd, 'tsconfig.json'),
        // set 'readonly' to avoid emitting tsbuildinfo,
        // as the generated tsbuildinfo will break fork-ts-checker
        mode: 'readonly',
        // avoid OOM issue
        memoryLimit: 8192,
        // use typescript of user project
        typescriptPath,
      },
      issue: {
        // ignore types errors from node_modules
        exclude: [
          ({ file = '' }) => NODE_MODULES_REGEX.test(file),
          { file: 'kmi.config.ts' },
          { file: 'config/*.ts' },
        ],
      },
      logger: {
        log() {
          // do nothing
          // we only want to display error messages
        },
        error(message: string) {
          console.error(message.replace(/ERROR/g, 'Type Error'))
        },
      },
    }

    const typeCheckerOptions = reduceConfigs({
      initial: defaultOptions,
      config: userConfig.forkTSChecker,
      mergeFn: deepmerge,
    })

    if (opts.env === Env.production) {
      logger.info('类型检查已启用,这可能需要一些时间。')
    }

    config
      .plugin(CHAIN_ID.PLUGIN.FORK_TS_CHECKER)
      .use(bundler.TsCheckerPlugin, [typeCheckerOptions])
  }
}
