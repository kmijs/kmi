import assert from 'node:assert'
import type {
  BabelConfigUtils,
  BabelLoaderOptions,
} from '@kmijs/bundler-rspack'
import type { StatsCompilation } from '@kmijs/bundler-shared/rspack'
import { fsExtra, logger, pathe, picocolors } from '@kmijs/shared'
import { BundlerTypeEnum, type IApi } from '@kmijs/types'
import { CORE_JS_DIR } from '../../constants'
import { bundlerRspack } from '../../utils/bundler'
import { prettyTime } from '../../utils/prettyTime'
import { applyCheckConfig } from './checkConfig'
import { applyIncremental } from './incremental'
import { applyLazyCompilation } from './lazyCompilation'

export default (api: IApi) => {
  api.describe({
    key: 'rspack',
    config: {
      schema({ zod }) {
        return zod
          .object({
            useBabel: zod.boolean().optional().describe('启动 babel 编译'),
            enableLessWoker: zod
              .boolean()
              .optional()
              .describe('启动 less 并行编译'),
            lazyCompilation: zod
              .union([zod.boolean(), zod.object({})])
              .optional()
              .describe('启动懒编译'),
            incremental: zod.boolean().optional().describe('启动增量编译'),
          })
          .partial()
      },
    },
    enableBy: api.EnableBy.config,
  })

  api.onCheckConfig(({ config }) => {
    // 禁用 mako 提示
    process.env.MAKO_AD = 'none'

    assert(!config.vite, 'rspack cannot be used together with vite.')
    assert(!config.mako, 'rspack cannot be used together with mako.')
  })

  api.modifyConfig((memo) => {
    memo.mfsu = false

    memo.rspack = {
      ...memo.rspack,
      // support modify babel config
      __babelLoaderOptions(ctx: BabelLoaderOptions, args: BabelConfigUtils) {
        api.applyPlugins({
          key: 'modifyRspackBabelLoaderOptions',
          type: api.ApplyPluginsType.modify,
          initialValue: ctx,
          args: args,
        })
      },
    }
    return memo
  })

  api.modifyAppData((memo) => {
    memo.bundler = BundlerTypeEnum.rspack
    memo.rspackVersion = bundlerRspack.rspackVersion
    memo.bundlerInfo = {
      ...memo.bundlerInfo,
      version: bundlerRspack.rspackVersion,
      rspackVersion: bundlerRspack.rspackVersion,
    }
    return memo
  })

  api.onStart(() => {
    if (['dev', 'build'].includes(api.name)) {
      logger.info(
        `Using ${picocolors.green('Rspack')} v${bundlerRspack.rspackVersion}`,
      )
    }
  })

  api.onBuildComplete(({ err, stats }) => {
    const hasErrors = stats.hasErrors()
    if (!err && !hasErrors) {
      const statsJson = stats.toJson({
        children: true,
        moduleTrace: true,
        timings: true,
        preset: 'errors-warnings',
      })

      // @ts-expect-error
      printTime(statsJson)
    }
  })

  api.onBuildComplete(async ({ err }) => {
    if (err && api.userConfig.forkTSChecker) {
      // rspack's type checking output will continue to be generated, to avoid interfering with subsequent processes, manually remove the file if it exists
      const absOutputPath = pathe.join(api.cwd, api.appData.outputPath)
      if (await fsExtra.exists(absOutputPath)) {
        await fsExtra.remove(absOutputPath)
      }
    }
  })

  api.bundlerChain((memo) => {
    if (process.env.LOCK_CORE_JS !== 'none') {
      memo.resolve.alias.set('core-js', CORE_JS_DIR)
    }
    return memo
  })

  applyLazyCompilation(api)
  applyCheckConfig(api)
  applyIncremental(api)
}

const printTime = (c: StatsCompilation) => {
  if (c.time) {
    const time = prettyTime(c.time / 1000)
    logger.info(picocolors.green(`Compiled successfully in ${time}`))
  }
}
