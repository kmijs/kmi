import { isPathString, normalizeToPosixPath } from './path'
import type { PathMatcher } from './pathSerializer'
import {
  applyMatcherReplacement,
  createDefaultPathMatchers,
  pathToRegex,
} from './pathSerializer'

export interface SnapshotSerializerOptions {
  cwd?: string
  workspace?: string
  replace?: PathMatcher[]
}

export function createSnapshotSerializer(options?: SnapshotSerializerOptions): {
  pathMatchers: PathMatcher[]
  test: (val: unknown) => boolean
  print: (val: unknown) => string
} {
  const {
    cwd = process.cwd(),
    workspace = process.cwd(),
    replace: customMatchers = [],
  } = options || {}

  const pathMatchers: PathMatcher[] = [
    { mark: 'root', match: cwd },
    { mark: 'root', match: pathToRegex(cwd) },
    { mark: 'workspace', match: workspace },
    { mark: 'workspace', match: pathToRegex(workspace) },
    ...customMatchers,
    ...createDefaultPathMatchers(workspace),
  ]

  pathMatchers
    .filter((matcher) => typeof matcher.match === 'string')
    .forEach((matcher) => {
      matcher.match = normalizeToPosixPath(matcher.match as string)
    })

  return {
    pathMatchers,
    // match path-format string
    test: (val: unknown) => typeof val === 'string' && isPathString(val),
    print: (val: unknown) => {
      const normalized = normalizeToPosixPath(val as string)
      const replaced = applyMatcherReplacement(
        pathMatchers,
        normalized,
      ).replace(/"/g, '\\"')

      return `"${replaced}"`
    },
  }
}
