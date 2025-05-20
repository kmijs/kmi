import { createRequire } from 'node:module'
import { join } from 'node:path'
import { chalk, logger } from '@kmijs/shared'
import 'zx/globals'

const require = createRequire(import.meta.url)

export async function writePackage(pkgName: string, message: string) {
  const cwd = process.cwd()
  const pkg = require(`${cwd}/package.json`)
  const { dependencies, devDependencies } = pkg
  const version = dependencies[pkgName] || devDependencies[pkgName]

  logger.event(`下载 ${pkgName} 到本地`)

  const compiledDir = join(cwd, 'compiled', pkgName)

  await $`pnpm patch ${pkgName}@${version} --edit-dir ${compiledDir}`

  logger.ready(
    `下载成功, 记得更新 ${chalk.green(message)} 中 ${pkgName} 插件的依赖`,
  )
}
