const DEPENDENCY_MATCH_TEMPL = /[\\/]node_modules[\\/](<SOURCES>)[\\/]/.source

export const createDependenciesRegExp = (
  ...dependencies: (string | RegExp)[]
) => {
  const sources = dependencies.map((d) =>
    typeof d === 'string' ? d : d.source,
  )
  const expr = DEPENDENCY_MATCH_TEMPL.replace('<SOURCES>', sources.join('|'))
  return new RegExp(expr)
}

const ensureArray = <T>(params: T | T[]): T[] => {
  if (Array.isArray(params)) {
    return params
  }
  return [params]
}

/**
 * Try to resolve npm package, return true if package is installed.
 */
export const isPackageInstalled = (
  name: string,
  resolvePaths: string | string[],
) => {
  try {
    require.resolve(name, { paths: ensureArray(resolvePaths) })
    return true
  } catch (err) {
    return false
  }
}
