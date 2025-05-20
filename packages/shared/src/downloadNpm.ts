import os from 'node:os'
import { join } from 'node:path'
import download from '../compiled/download'
import fsExtra from '../compiled/fs-extra'
import picocolors from '../compiled/picocolors'
import { $, cd } from '../compiled/zx'
import * as logger from './logger'
import { getNpmConfig } from './package'
import { spinner } from './spinner'

export interface DownloadNpmOptions {
  dest?: string
  value: string
  force?: boolean
}

export class DownloadNpm {
  private tmp: string
  constructor(private opts: DownloadNpmOptions) {
    this.tmp = this.opts.dest ?? join(os.tmpdir(), '.kmi-remote-npm')
  }

  private async installDependencies(
    dist: string,
    s: ReturnType<typeof spinner>,
    pkgName: string,
  ) {
    try {
      const pkg = require(join(dist, './package.json'))
      if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
        const time = Date.now()
        s.message(`正在安装 ${picocolors.cyan(pkgName)} 的额外依赖...`)
        $.verbose = false
        cd(dist)
        await $`npm install --production`
        $.verbose = true
        s.message(`${picocolors.cyan(pkgName)} 的额外依赖安装成功`)
        logger.verbose(
          `[DownloadNpm] ${pkg.name} 依赖安装成功 ${Date.now() - time}ms`,
        )
      }
    } catch (e) {
      s.stop(`${picocolors.cyan(pkgName)} 的额外依赖安装失败`, 2)
      logger.error(`${picocolors.cyan(pkgName)} 的额外依赖安装失败`, e)
      process.exit(1)
    }
  }

  private async downloadNpm(pkgName: string) {
    const s = spinner()
    try {
      const [plName, plVersion] = this.pkgNameAnalyses(pkgName)
      const { data } = await getNpmConfig(plName, plVersion)
      const dist = join(this.tmp, `${data.name}__${data.version}`)

      // 如果资源存在 则直接返回
      const pkgPath = join(dist, 'package.json')
      if (
        fsExtra.existsSync(dist) &&
        fsExtra.statSync(dist).isDirectory() &&
        fsExtra.existsSync(pkgPath) &&
        !this.opts.force
      ) {
        logger.verbose('[DownloadNpm] 使用 npm 包缓存', dist)
        return dist
      }
      s.start(`正在下载依赖包 ${picocolors.cyan(pkgName)}...`)

      const { tarball } = data.dist

      await download(tarball, dist, {
        extract: true,
        strip: 1,
        headers: {
          accept: 'application/tgz',
        },
      })
      await this.installDependencies(dist, s, plName)
      s.stop(`依赖包 ${picocolors.cyan(pkgName)} 安装成功`)
      return dist
    } catch (error: any) {
      s.stop(`依赖包 ${picocolors.cyan(pkgName)} 安装失败 `, 2)
      if (error?.response) {
        logger.error(`未找到依赖包 ${picocolors.cyan(pkgName)}`)
      } else {
        logger.error(error.message)
      }
      process.exit(1)
    }
  }

  public async getNpmFile() {
    return this.downloadNpm(this.opts.value)
  }

  pkgNameAnalyses(name = '') {
    try {
      const plRe = /^(@?[^@]+)(?:@(.+))?$/

      const [, plName = name, plVersion = 'latest'] = name.match(plRe) || []
      return [plName, plVersion]
    } catch (error) {
      return [name, 'latest']
    }
  }
}
