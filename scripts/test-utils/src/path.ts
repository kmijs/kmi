import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import _ from '@kmijs/shared/compiled/lodash'
import upath from 'upath'

export const isPathString = (test: string): boolean =>
  path.posix.basename(test) !== test || path.win32.basename(test) !== test

export const isRelativePath = (test: string): boolean =>
  /^\.\.?($|[\\/])/.test(test)

export const normalizeOutputPath = (s: string): string =>
  s.replace(/\\/g, '\\\\')

export const normalizeToPosixPath = (p: string | undefined): string =>
  upath
    .normalizeSafe(path.normalize(p || ''))
    .replace(/^([a-zA-Z]+):/, (_, m: string) => `/${m.toLowerCase()}`)

/**
 * Compile path string to RegExp.
 * @note Only support posix path.
 */
export function compilePathMatcherRegExp(match: string | RegExp): RegExp {
  if (typeof match !== 'string') {
    return match
  }
  const escaped = _.escapeRegExp(match)
  return new RegExp(`(?<=\\W|^)${escaped}(?=\\W|$)`)
}

export function getRealTemporaryDirectory(): string | null {
  let ret: string | null = null
  try {
    ret = os.tmpdir()
    ret = fs.realpathSync(ret)
  } catch {}
  return ret
}

export function splitPathString(str: string): string[] {
  return str.split(/[\\/]/)
}
