import 'zx/globals'
import assert from 'node:assert'
import {
  chalk,
  dayjs,
  fsExtra,
  logger,
  pathe,
  prompts,
  yParser,
} from '@kmijs/shared'
import type { ProjectManifest } from '@pnpm/types'
import getGitRepoInfo from 'git-repo-info'
import { PATHS } from './utils/constants'
import { getPackage } from './utils/package'

interface Manifest extends ProjectManifest {
  dir: string
}

;(async () => {
  const args = yParser(process.argv.slice(2), {
    boolean: ['dry'],
    default: {
      dry: false,
    },
  })

  const tag = 'v2canary'

  const { branch } = getGitRepoInfo()
  logger.info(`branch: ${branch}`)

  logger.event('check publishConfig registry')
  const filterProject = await getPackage()

  // check npm registry
  logger.event('check npm registry')
  const registry = (await $`npm config get registry`).stdout.trim()
  assert(
    registry === 'https://registry.npmjs.org/',
    'npm registry is not https://registry.npmjs.org/',
  )

  const pkgsMap = new Map<string, Manifest>()
  filterProject.forEach((project) => {
    const { dir, manifest } = project
    pkgsMap.set(manifest.name!, { ...manifest, dir })
  })

  const pkgs = Array.from(pkgsMap.keys())

  logger.info(`pkgs(${pkgs.length}):`)
  pkgs.forEach((pkg) => {
    console.log(`      - ${chalk.yellow(pkg)}`)
  })

  const isDry = args.dry

  if (isDry) {
    logger.warn('开启 dry 模式, 只测试不进行真实发布')
  }

  if (!isDry && !args.skipGitCheck) {
    // check git status
    logger.event('check git status')
    const isGitClean = (await $`git status --porcelain`).stdout.trim().length
    assert(!isGitClean, 'git status is not clean')
    // check git remote update
    logger.event('check git remote update')
    await $`git fetch`
    const gitStatus = (await $`git status --short --branch`).stdout.trim()
    assert(!gitStatus.includes('behind'), 'git status is behind remote')
  } else {
    logger.event('is dry skipped git check')
  }

  logger.event('check pnpm login status')
  ;(await $`pnpm whoami`).stdout.trim()

  if (!isDry) {
    logger.event('build packages')
    await $`pnpm build`
  }

  logger.event('生成版本')
  function getVersion() {
    const { version: oldVersion } = fsExtra.readJsonSync(
      pathe.join(PATHS.ROOT, 'packages/preset-bundler/package.json'),
    )
    const mainVersion = '2.0.0'
    const day = dayjs().format('YYYYMMDD')
    if (oldVersion.includes(`-canary.${day}`)) {
      const count = oldVersion.split(`-canary.${day}.`)[1]
      return `${mainVersion}-canary.${day}.${+count + 1}`
    }
    return `${mainVersion}-canary.${day}.0`
  }

  const version = getVersion()

  const ask = await prompts([
    {
      type: 'confirm',
      message: `当前发布的版本是${version}, 是否确认执行发布`,
      name: 'isRelease',
    },
  ])

  if (!ask.isRelease) {
    logger.warn('exit release')
    return
  }

  logger.event('update package version')

  for (const pkg of filterProject) {
    pkg.writeProjectManifest(
      Object.assign(pkg.manifest, {
        version,
      }),
    )
  }

  // pnpm publish
  logger.event('pnpm publish')

  await $`pwd`

  // 设置 npm token
  await $`npm config set registry https://registry.npmjs.org/`
  await $`npm config set //registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`

  // dpcs https://pnpm.io/zh/cli/publish
  await $`pnpm -r publish --tag ${tag} --filter=@kmijs/* --force
  ${isDry ? '--dry-run' : ''}`

  logger.event('publish successful')
})().catch((error) => {
  logger.error(error)
  throw error
})
