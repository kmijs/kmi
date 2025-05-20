import path from 'node:path'
import { pkgUpSync } from '@kmijs/shared'
export function pkgUpContainsName(file: string): string | null {
  const pkgPath = pkgUpSync({ cwd: file })
  if (!pkgPath) return null
  const { name } = require(pkgPath)
  // invalid package
  if (!name) {
    return pkgUpContainsName(path.resolve(pkgPath, '../..'))
  }
  return pkgPath
}
