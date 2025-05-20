import { DEFAULT_INLINE_LIMIT } from '@kmijs/bundler-shared'
import type { IUserConfig, InlineLimitConfig } from '../types'

export function getInlineLimit(
  userConfig: IUserConfig,
  type: keyof InlineLimitConfig,
) {
  const { inlineLimit } = userConfig
  if (typeof inlineLimit === 'number') {
    // if (['media', 'svg'].includes(type)) {
    //   return 0
    // }
    return inlineLimit
  }

  return inlineLimit?.[type] ?? DEFAULT_INLINE_LIMIT
}
