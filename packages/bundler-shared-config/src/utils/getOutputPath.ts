import { DEFAULT_OUTPUT_PATH } from '@kmijs/bundler-shared'
import {
  ASSETS_DIST_DIR,
  CSS_DIST_DIR,
  FONT_DIST_DIR,
  IMAGE_DIST_DIR,
  JS_DIST_DIR,
  SVG_DIST_DIR,
} from '../constants'
import type { OutputPathConfig, SharedConfigOptions } from '../types'

export function getOutputPath(
  config: SharedConfigOptions,
  type: keyof OutputPathConfig,
) {
  const { userConfig, staticPathPrefix } = config
  const { outputPath = DEFAULT_OUTPUT_PATH } = userConfig

  // 兼容 1.x
  if (typeof outputPath === 'string') {
    if (type === 'root') {
      return outputPath
    }
    if (['js', 'css'].includes(type)) {
      return ''
    }
    return staticPathPrefix
  }

  switch (type) {
    case 'root':
      return outputPath.root ?? DEFAULT_OUTPUT_PATH
    case 'js':
      return outputPath.js ?? JS_DIST_DIR
    case 'css':
      return outputPath.css ?? CSS_DIST_DIR
    case 'svg':
      return outputPath.svg ?? SVG_DIST_DIR
    case 'font':
      return outputPath.font ?? FONT_DIST_DIR
    case 'image':
      return outputPath.image ?? IMAGE_DIST_DIR
    default:
      return ASSETS_DIST_DIR
  }
}
