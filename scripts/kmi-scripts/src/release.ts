import { chalk, fsExtra, logger, prompts, yParser } from '@kmijs/shared'
import getGitRepoInfo from 'git-repo-info'
import 'zx/globals'
import assert from 'node:assert'
import { join } from 'node:path'
import type { ProjectManifest } from '@pnpm/types'
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

  // 使用给定的tag 发布package。 默认情况下 是 latest
  const tag = args.tag || 'latest'

  // https://www.npmjs.cn/cli/dist-tag/
  const distTag = ['latest', 'next', 'beta', 'dev', 'canary', 'nextv2']

  assert(distTag.indexOf(tag) !== -1, `tag 仅支持 ${distTag.join(', ')}`)

  // 在对预发布版本进行版本控制时指定标识符
  const preid = args.preid || 'next'

  // preid 仅支持
  const arrPreid = ['beta', 'rc', 'next', 'alpha', 'canary']
  assert(arrPreid.indexOf(preid) !== -1, `preid 仅支持 ${arrPreid}`)

  const isDry = args.dry

  const { branch } = getGitRepoInfo()
  logger.info(`branch: ${branch}`)

  // 检查是否是主干分支
  if (branch !== 'main') {
    const { isOK } = await prompts([
      {
        type: 'confirm',
        message: `当前分支${chalk.bold(branch)}不是主干分支 main, 是否执行发布`,
        name: 'isOK',
      },
    ])

    if (!isOK) {
      logger.warn('exit release')
      return
    }
  }

  const filterProject = await getPackage()

  const pkgsMap = new Map<string, Manifest>()

  logger.event('check publishConfig registry')
  const registry = (await $`npm config get registry`).stdout.trim()
  assert(
    registry === 'https://registry.npmjs.org/',
    'npm registry is not https://registry.npmjs.org/',
  )

  filterProject.forEach((project) => {
    const { dir, manifest } = project
    pkgsMap.set(manifest.name!, { ...manifest, dir })
  })

  const pkgs = Array.from(pkgsMap.keys())

  logger.info(`pkgs(${pkgs.length}):`)
  pkgs.forEach((pkg) => {
    console.log(`      - ${chalk.yellow(pkg)}`)
  })

  if (!isDry) {
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

  logger.event('build packages')
  await $`pnpm build`

  logger.event('使用变更集自动更新发布版本和变更日志')

  async function bumpVersion() {
    const versionStatus = await $`pnpm changeset version`
    if (versionStatus.stderr.includes(' No unreleased changesets found')) {
      process.exit()
    }
  }

  if (tag === 'next' || tag === 'nextv2') {
    try {
      logger.event(
        `创建一个预发布版本进行测试 预发布版本标识符(preid):${preid}`,
      )
      await $`pnpm changeset pre enter ${preid}`
      await bumpVersion()
      await $`pnpm changeset pre exit`
    } catch (error) {
      await $`pnpm changeset pre exit`
      logger.error(error)
      process.exit()
    }
  } else {
    await bumpVersion()
  }

  const { version } = fsExtra.readJsonSync(
    join(PATHS.ROOT, 'packages/preset-bundler/package.json'),
  )
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

  logger.event(`publish version ${version}`)

  if (!isDry) {
    // commit
    logger.event('commit')

    await $`git add .`

    await $`git commit --all --message "chore(release): ${version}"`

    // git tag
    logger.event('git tag')
    await $`git tag v${version}`

    // git push
    logger.event('git push')
    await $`git push origin ${branch} --tags`
  } else {
    logger.event('is dry skipped git commit')
  }

  // pnpm publish
  logger.event('pnpm publish')

  // 设置 npm token
  await $`npm config set registry https://registry.npmjs.org/`
  await $`npm config set //registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`

  // dpcs https://pnpm.io/zh/cli/publish
  await $`pnpm publish -r --tag ${tag}  ${isDry ? '--dry-run' : ''}`

  logger.event('publish successful')
})().catch((error) => {
  logger.error(error)
})
