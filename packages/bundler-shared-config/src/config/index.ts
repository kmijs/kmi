import type { SharedConfigOptions } from '../types'
import { applyAsset } from './asset'
import { applyBasic } from './basic'
import { applyBundleAnalyzer } from './bundleAnalyzer'
import { applyCaseSensitivePaths } from './caseSensitivePaths'
import { applyCompress } from './compress'
import { applyCopy } from './copy'
import { applyCss } from './css/css'
import { applyForkTSChecker } from './forkTSChecker'
import { applyIgnore } from './ignore'
import { applyManifest } from './manifest'
import { addNodePolyfill } from './nodePolyfill'
import { applyOutput } from './output'
import { applyRuntimePublicPath } from './runtimePublicPath'
import { applyTarget } from './target'

export function addSharedConfig(opts: SharedConfigOptions) {
  const isServer = opts.target === 'node'

  // target
  applyTarget(opts)

  // 处理基础配置
  applyBasic(opts)

  // 处理 css
  applyCss(opts)

  if (!isServer) {
    // node polyfill
    addNodePolyfill(opts)
  }

  // 处理静态资源
  applyAsset(opts)
  // 忽略 moment 的 locale
  applyIgnore(opts)

  // 处理 copy
  if (!opts.disableCopy) {
    applyCopy(opts)
  }

  // manifest
  applyManifest(opts)

  // 文件大小写检查
  applyCaseSensitivePaths(opts)

  // ts 检查
  applyForkTSChecker(opts)

  // css 处理
  applyOutput(opts)

  // 压缩
  applyCompress(opts)

  // 分析
  if (process.env.ANALYZE) {
    applyBundleAnalyzer(opts)
  }

  // 运行时公共路径
  applyRuntimePublicPath(opts)
}
