import { posix, win32 } from 'node:path'

function allIndexesOf(source: string, match: string): number[] {
  const indexes: number[] = []
  let lastCheckedIndex: number | undefined

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const index = source.indexOf(match, lastCheckedIndex)
    if (index !== -1) {
      indexes.push(index)
      lastCheckedIndex = index + match.length
    } else {
      break
    }
  }

  return indexes
}

/**
 * input '/workspace/foo/node_modules/@foo/bar/node_modules/abc/example.js'
 * rootPath '/workspace/foo'
 * return {
 *   path: '/workspace/foo/node_modules/@foo/bar/node_modules/abc'
 *   moduleName: 'abc'
 *   dependentPath: 'node_modules/@foo/bar/node_modules/abc'
 * }
 */
export function resolveNodeModulePath(fullPath: string, rootPath: string) {
  const modulesMatch = allIndexesOf(fullPath, 'node_modules')

  // not in node_modules
  if (!modulesMatch.length) {
    return undefined
  }
  const lastNodeModulesIndex =
    modulesMatch[modulesMatch.length - 1] + /* length of 'node_modules/' */ 13
  const nodeModulesPath = fullPath.slice(0, lastNodeModulesIndex)
  const shortPath = fullPath.slice(lastNodeModulesIndex)

  const path = resolvePathFunctions(fullPath)
  const shortPathParts = shortPath.split(path.sep)
  const moduleName = shortPathParts[0].startsWith('@')
    ? `${shortPathParts[0]}/${shortPathParts[1]}`
    : shortPathParts[0]

  const modulePath = path.join(nodeModulesPath, moduleName)
  const dependentPath = path.relative(rootPath, modulePath)

  return {
    path: modulePath,
    moduleName,
    dependentPath,
  }
}

function resolvePathFunctions(test: string) {
  if (test.startsWith('/')) {
    return posix
  }

  return /\\/.test(test) ? win32 : posix
}
