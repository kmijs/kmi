import { createRequire } from 'node:module'
import path from 'node:path'
import { fsExtra as fs, logger } from '@kmijs/shared'

const require = createRequire(import.meta.url)

const base = process.cwd()

!(async () => {
  const { default: tasks } = await import(path.join(base, 'scripts/tasks.ts'))
  for (const task of tasks) {
    try {
      const { pkgName } = task
      logger.event(`${pkgName} pacth`)

      await task.patch()
      logger.event(`create package.json for ${pkgName}`)
      const target = `compiled/${pkgName}`
      const targetPath = path.join(base, target)

      const packageRoot = path.dirname(
        require.resolve(`${pkgName}/package.json`, { paths: [base] }),
      )

      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
      )

      fs.writeJSONSync(path.join(targetPath, 'package.json'), {
        name: pkgJson.name,
        main: pkgJson.main,
        types: pkgJson.types,
        ...(pkgJson.author ? { author: pkgJson.author } : {}),
        ...(pkgJson.license ? { license: pkgJson.license } : {}),
        ...(pkgJson.dependencies ? { dependencies: pkgJson.dependencies } : {}),
      })
      logger.info(`${task.pkgName} 已打包`)
    } catch (err) {
      logger.error(`${task.pkgName} 打包失败`, err)
    }
  }
})()
