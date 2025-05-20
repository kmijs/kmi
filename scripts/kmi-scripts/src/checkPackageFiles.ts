import { join } from 'node:path'
import { logger } from '@kmijs/shared'
import { isMatch } from 'matcher'
import 'zx/globals'
import { findWorkspacePackages } from '@pnpm/find-workspace-packages'
;(async () => {
  const COMMON_IGNORES = [
    // deps
    'node_modules',
    // for test
    'fixtures',
    'examples',
    'scripts',
    'tests',
    'e2e',
    // source
    'src',
    'bundles',
    // doc
    '*.md',
    // config files
    'tsconfig*.json',
    '*.config.js',
    'package.json',
    'temp',
    '__tests__',
    'temp-*',
    'kmi.config.ts',
    'typedoc.json',
    'prebundle.config.mjs',
  ]

  const wsDir = new URL('../../../', import.meta.url).pathname

  const allProjects = await findWorkspacePackages(wsDir)

  allProjects.forEach((project) => {
    const { dir, manifest } = project
    if (
      dir.indexOf('/packages/') !== -1 ||
      dir.indexOf('/codemods/') !== -1 ||
      dir.indexOf('/plugins/') !== -1 ||
      dir.indexOf('/presets/') !== -1 ||
      dir.indexOf('/solutions/') !== -1 ||
      dir.indexOf('/devtools/') !== -1 ||
      dir.indexOf('/runtimes/') !== -1 ||
      dir.indexOf('/templates/') !== -1
    ) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => !isMatch(f, COMMON_IGNORES) && !f.startsWith('.'))

      // @ts-ignore
      const missingAddFiles = files.filter((f) => !isMatch(f, manifest.files))

      if (missingAddFiles.length > 0) {
        logger.error('Checking package:', manifest.name)
        logger.error(
          `  "${missingAddFiles.join(
            ', ',
          )}"  missing in the package.json files field`,
        )
        throw new Error('Check packages files failed')
      }
    } else {
      if (manifest.private !== true) {
        manifest.private = true
        logger.warn(
          chalk.yellow(`Set '${manifest.name}' example as private package`),
        )
      }
      fs.writeFileSync(
        join(dir, 'package.json'),
        `${JSON.stringify(manifest, null, 2)}\n`,
        'utf-8',
      )
    }
  })
  logger.ready('Check packages success')
})()
