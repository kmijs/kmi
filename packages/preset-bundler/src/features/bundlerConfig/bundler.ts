import assert from 'node:assert'
import { reduceConfigsAsyncWithContext } from '@kmijs/bundler-shared/compiled/reduce-configs'
import { picocolors } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'bundler',
    config: {
      schema({ zod }) {
        return zod.union([zod.record(zod.string(), zod.any()), zod.function()])
      },
    },
    enableBy: api.EnableBy.config,
  })

  api.onCheckConfig(() => {
    if (typeof api.config.bundler === 'object') {
      assert(
        !api.config.bundler.entry,
        `${picocolors.cyan(
          'bundler.entry',
        )} configuration is invalid, Umi has configured the entry by default, please do not configure it repeatedly`,
      )
    }
  })

  api.modifyBundlerConfig({
    async fn(memo, utils) {
      const mergeConfig = reduceConfigsAsyncWithContext({
        initial: memo,
        config: api.config.bundler,
        ctx: utils,
        mergeFn: utils.mergeConfig,
      })

      return mergeConfig
    },
    stage: Number.MAX_SAFE_INTEGER,
  })
}
