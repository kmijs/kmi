import { existsSync } from 'node:fs'

export function tryFiles(paths: string[]) {
  return paths.map((path) => existsSync(path) && path).filter(Boolean)
}
