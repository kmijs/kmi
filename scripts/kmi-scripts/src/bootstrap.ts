import path from 'node:path'
import { version } from '../../../packages/bundler-rspack/package.json'
import { PATHS } from './utils/constants'
import { getPackage } from './utils/package'
!(async () => {
  const wsDir = PATHS.ROOT
  const filterProject = await getPackage()

  for (const pkg of filterProject) {
    const pkgFile = path.relative(wsDir, pkg.dir)
    pkg.writeProjectManifest(
      Object.assign(pkg.manifest, {
        version,
        repository: {
          type: 'git',
          url: `https://github.com/kmijs/kmi/tree/main/${pkgFile}`,
        },
        publishConfig: {
          access: 'public',
        },
      }),
    )
  }
})()
