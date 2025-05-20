import { JSMinifier } from '@kmijs/bundler-compiled'
import { chalk, logger } from '@kmijs/shared'
import { DEFAULT_ESBUILD_TARGET_KEYS } from '../constants'

interface IOpts {
  targets: Record<string, any>
  jsMinifier: `${JSMinifier}`
}

export function getEsBuildTarget({ targets, jsMinifier }: IOpts) {
  if (targets.ie && jsMinifier === JSMinifier.esbuild) {
    logger.error(
      `${chalk.red(
        'jsMinifier: esbuild',
      )} 不支持 IE 浏览器作为目标环境,你可以使用 ${chalk.green(
        `jsMinifier: 'terser'`,
      )}`,
    )
    throw new Error('不支持 IE 浏览器')
  }

  return Object.keys(targets)
    .filter((key) => DEFAULT_ESBUILD_TARGET_KEYS.includes(key))
    .map((key) => {
      return `${key}${targets[key] === true ? '0' : targets[key]}`
    })
}
