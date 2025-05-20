import { dirname } from '../compiled/pathe'
import resolve from '../compiled/resolve'

export function resolveProjectDep(opts: {
  pkg: any
  cwd: string
  dep: string
}) {
  if (
    opts.pkg.dependencies?.[opts.dep] ||
    opts.pkg.devDependencies?.[opts.dep]
  ) {
    return dirname(
      resolve.sync(`${opts.dep}/package.json`, {
        basedir: opts.cwd,
      }),
    )
  }
}

export function resolveProjectPath(opts: {
  pkg: any
  cwd: string
  dep: string
  path: string
}) {
  if (
    opts.pkg.dependencies?.[opts.dep] ||
    opts.pkg.devDependencies?.[opts.dep]
  ) {
    return resolve.sync(`${opts.dep}/${opts.path}`, {
      basedir: opts.cwd,
    })
  }
}

/**
 *
 * 获取依赖包path 优化从项目开始找
 * @export
 * @param {{ pkg: any; cwd: string; dep: string }} opts
 * @return {*}
 */
export function resolveDepPath(opts: { pkg: any; cwd: string; dep: string }) {
  return (
    resolveProjectDep({
      pkg: opts.pkg,
      cwd: opts.cwd,
      dep: opts.dep,
    }) || dirname(require.resolve(`${opts.dep}/package.json`))
  )
}
