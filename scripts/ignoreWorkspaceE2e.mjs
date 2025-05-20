import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const { $ } = require('../packages/shared/compiled/zx')
const fs = require('../packages/shared/compiled/fs-extra')
const _ = require('../packages/shared/compiled/lodash')

const __dirname = dirname(fileURLToPath(import.meta.url))
const cwd = join(__dirname, '../')

const absWorkspacePath = join(cwd, 'pnpm-workspace.yaml')
const version = require('../packages/kmijs/package.json').version
const kmiVersion = process.env.KCI_KMI_VERSION ?? version

const rootPkgJsonPath = join(cwd, 'package.json')
const rootPkgJson = fs.readJSONSync(rootPkgJsonPath)

async function main() {
  console.log('kmi version', version)
   // 处理 postinstall
  delete rootPkgJson.scripts.postinstall
  delete rootPkgJson.pnpm.patchedDependencies

  await fs.writeJSON(rootPkgJsonPath, rootPkgJson)


  console.log('更新工作区配置')
  // 工作区配置
  await fs.writeFile(absWorkspacePath, `
  packages:
  - 'e2e/*'
  - 'scripts/*'
  - '!**/compiled/**'
    `)

  await $`KCI_IGNORE_WORKSPACE_E2E=1 pnpm install --no-lockfile`
  await $`pnpm exec playwright install chromium`
  await $`pnpm test:e2e`
  await $`git checkout -- .`
}

main()
