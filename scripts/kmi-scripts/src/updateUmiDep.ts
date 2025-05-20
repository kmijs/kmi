import 'zx/globals'
import { logger } from '@kmijs/shared'

// 更新 umi 依赖
;(async () => {
  try {
    logger.event('update umi deps')
    await $`pnpm up --latest --recursive @umijs/*`

    logger.event('umi plugins patch')
    await $`rm -rf ./packages/react/compiled/@umijs`
    await $`pnpm --filter @kmijs/react run build:deps`

    logger.event('执行 umi-max e2e 测试')
    await $`pnpm --filter @examples/umi-max run e2e:dev:ci`
  } catch (error) {
    logger.fatal('更新 umi 依赖失败')
    throw error
  }
})()
