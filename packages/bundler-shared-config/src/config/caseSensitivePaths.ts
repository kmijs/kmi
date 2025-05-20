// @ts-expect-error 无类型
import CaseSensitivePaths from '@kmijs/bundler-compiled/compiled/@umijs/case-sensitive-paths-webpack-plugin'
import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyCaseSensitivePaths(opts: SharedConfigOptions) {
  const { config } = opts
  // 文件大小写
  config.plugin(CHAIN_ID.PLUGIN.CASE_SENSITIVE_PATHS).use(CaseSensitivePaths)
}
