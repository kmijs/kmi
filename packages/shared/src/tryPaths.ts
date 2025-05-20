import { existsSync } from 'node:fs'

/**
 * @description 检查路径是否存在
 * @param paths - 路径数组
 * @returns 第一个存在的路径
 */
export function tryPaths(paths: string[]) {
  for (const path of paths) {
    if (existsSync(path)) return path
  }
}
