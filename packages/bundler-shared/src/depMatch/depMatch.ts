import { dirname } from 'node:path'
import { semver, winPath } from '@kmijs/shared'
import { pkgUpContainsName } from './pkgUpContainsName'

// 扩展缓存结构，同时缓存包信息和匹配结果
interface CacheItem {
  result: boolean
  pkgInfo?: { name: string; version: string }
}

// 使用两级缓存：目录 -> 包名和版本组合 -> 结果
const dirCache = new Map<string, CacheItem>()
const pkgInfoCache = new Map<string, { name: string; version: string }>()

// 添加版本匹配结果缓存
const versionMatchCache = new Map<string, boolean>()

export function cleanCache() {
  dirCache.clear()
  pkgInfoCache.clear()
  versionMatchCache.clear()
}

export function isMatch(opts: {
  path: string
  pkgs: Record</*name*/ string, /*version*/ string[]>
}): boolean {
  // 基于目录的缓存，命中率更高
  const dir = winPath(dirname(opts.path))

  // 检查目录缓存
  if (dirCache.has(dir)) {
    return dirCache.get(dir)!.result
  }

  const pkgPath = pkgUpContainsName(opts.path)

  if (!pkgPath) {
    const cacheItem: CacheItem = { result: false }
    dirCache.set(dir, cacheItem)
    return false
  }

  // 复用包信息
  let pkgInfo = pkgInfoCache.get(pkgPath)
  if (!pkgInfo) {
    pkgInfo = require(pkgPath)
    pkgInfoCache.set(pkgPath, pkgInfo!)
  }

  if (!pkgInfo) {
    const cacheItem: CacheItem = { result: false }
    dirCache.set(dir, cacheItem)
    return false
  }

  const { name, version } = pkgInfo!
  let result = false

  if (opts.pkgs[name]) {
    // 为版本匹配创建缓存键
    const versions = opts.pkgs[name]
    const cacheKey = `${name}@${version}|${versions.join(',')}`

    // 检查版本匹配缓存
    if (versionMatchCache.has(cacheKey)) {
      result = versionMatchCache.get(cacheKey)!
    } else {
      result = versions.some((v) => semver.satisfies(version, v))
      versionMatchCache.set(cacheKey, result)
    }
  }

  // 缓存结果
  const cacheItem: CacheItem = {
    result,
    pkgInfo,
  }
  dirCache.set(dir, cacheItem)

  return result
}

// 为 es5-imcompatible-versions 配置添加缓存
let es5ImcompatiblePkgs: Record<string, string[]> | null = null

export function es5ImcompatibleVersionsToPkg() {
  if (es5ImcompatiblePkgs) {
    return es5ImcompatiblePkgs
  }

  const {
    config: { 'es5-imcompatible-versions': config },
  } = require('es5-imcompatible-versions/package.json')

  es5ImcompatiblePkgs = Object.keys(config).reduce<Record<string, string[]>>(
    (memo, key) => {
      memo[key] = /* versions */ Object.keys(config[key])
      return memo
    },
    {} as any,
  )

  return es5ImcompatiblePkgs
}
