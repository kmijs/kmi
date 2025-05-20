import { findWorkspacePackages } from '@pnpm/find-workspace-packages'
import { PATHS } from './constants'

export async function getPackage() {
  const wsDir = PATHS.ROOT
  const allProjects = await findWorkspacePackages(wsDir)

  // 过滤出需要的 package
  return allProjects.filter((item) => {
    return (
      item.dir.indexOf('/packages/') !== -1 ||
      item.dir.indexOf('/plugins/') !== -1 ||
      item.dir.indexOf('/presets/') !== -1 ||
      item.dir.indexOf('/codemods/') !== -1 ||
      item.dir.indexOf('/solutions/') !== -1 ||
      item.dir.indexOf('/templates/') !== -1 ||
      item.dir.indexOf('/devtools/') !== -1 ||
      item.dir.indexOf('/runtimes/') !== -1
    )
  })
}
