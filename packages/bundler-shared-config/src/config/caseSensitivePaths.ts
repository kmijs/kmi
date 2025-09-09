// @ts-expect-error 无类型
import CaseSensitivePaths from '@kmijs/bundler-compiled/compiled/@umijs/case-sensitive-paths-webpack-plugin'
import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { SharedConfigOptions } from '../types'

export function applyCaseSensitivePaths(opts: SharedConfigOptions) {
  const { config, userConfig } = opts

  // 如果用户明确设置为 false，则跳过插件应用
  if (userConfig.caseSensitivePaths === false) {
    return
  }

  // 文件大小写
  config.plugin(CHAIN_ID.PLUGIN.CASE_SENSITIVE_PATHS).use(CaseSensitivePaths)
}
