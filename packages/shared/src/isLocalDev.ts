import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '../../../')
const rootPkg = join(root, './package.json')

export const isLocalDev = (): boolean => {
  const isLocal = existsSync(rootPkg) && require(rootPkg)._local
  return !!isLocal
}
