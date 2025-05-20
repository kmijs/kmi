import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { merge } from '../compiled/lodash'

export function updatePackageJSON({
  opts,
  cwd = process.cwd(),
}: {
  opts: object
  cwd?: string
}): void {
  const packageJsonPath = resolve(cwd, 'package.json')
  const pkg = require(packageJsonPath)
  const projectPkg = merge(pkg, opts) as object
  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(projectPkg, null, 2)}\n`,
    'utf-8',
  )
}
