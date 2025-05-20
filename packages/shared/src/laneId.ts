import crypto from 'node:crypto'
import gitUrlParse from '../compiled/git-url-parse'
import { $ } from '../compiled/zx'
import * as logger from './logger'

export async function getLaneId(solution: string, pkgName?: string) {
  const originUrl = await getGitOriginUrl()
  if (originUrl.length === 0) {
    return ''
  }

  const { full_name } = gitUrlParse(originUrl) as {
    full_name: string
  }
  const content = {
    full_name,
    pkgName: pkgName || 'no-pkg-name',
    solution,
  }

  logger.verbose('白名单 id 生成内容', content)

  const laneId = crypto
    .createHash('sha256')
    .update(JSON.stringify(content))
    .digest('hex')
    .substring(0, 8)

  return laneId
}

async function getGitOriginUrl(): Promise<string> {
  try {
    $.verbose = false
    return (await $`git config --get remote.origin.url`).stdout.trim()
  } catch (error) {
    return ''
  } finally {
    $.verbose = true
  }
}
