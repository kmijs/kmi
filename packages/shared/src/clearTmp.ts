import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import rimraf from '../compiled/rimraf'
import { CACHE_DIR_NAME } from './constants'

export function clearTmp(absTmpPath: string) {
  if (!existsSync(absTmpPath)) return
  readdirSync(absTmpPath).forEach((file) => {
    if (file === CACHE_DIR_NAME) return
    rimraf.sync(join(absTmpPath, file))
  })
}
