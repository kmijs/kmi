import fs from '../compiled/fs-extra'
import path from '../compiled/pathe'
import { isLocalDev } from './isLocalDev'
import * as logger from './logger'
import { type NpmClient, getNpmClient, installWithNpmClient } from './npmClient'

type Dependencies = Record<string, string>

interface PackageJson {
  dependencies?: Dependencies
  devDependencies?: Dependencies
  scripts?: { [key: string]: string }
  [key: string]: unknown
}

interface PackageManagerOptions {
  cwd: string
}

export class PackageManager {
  private cwd: string
  private packageJson: PackageJson
  private packageJsonPath: string

  constructor(options: PackageManagerOptions) {
    const { cwd } = options
    this.cwd = cwd
    this.packageJsonPath = path.join(cwd, 'package.json')
    this.packageJson = this.readPackageJson()
  }

  private readPackageJson(): PackageJson {
    try {
      return fs.readJSONSync(this.packageJsonPath)
    } catch (error) {
      throw new Error(`Failed to read package.json: ${error}`)
    }
  }

  public async writePackageJson(): Promise<void> {
    try {
      await fs.writeJSON(this.packageJsonPath, this.packageJson, { spaces: 2 })
    } catch (error) {
      throw new Error(`Failed to write package.json: ${error}`)
    }
  }

  public addDeps(deps: Dependencies): void {
    if (!this.packageJson.dependencies) {
      this.packageJson.dependencies = {}
    }

    Object.entries(deps).forEach(([name, version]) => {
      this.packageJson.dependencies![name] = version
    })
  }

  public addDevDeps(deps: Dependencies): void {
    if (!this.packageJson.devDependencies) {
      this.packageJson.devDependencies = {}
    }

    Object.entries(deps).forEach(([name, version]) => {
      this.packageJson.devDependencies![name] = version
    })
  }

  public async installDeps(_npmClient?: NpmClient): Promise<void> {
    try {
      await this.writePackageJson()

      // 本地开发环境不执行依赖安装
      if (isLocalDev()) {
        return
      }

      const npmClient = _npmClient || getNpmClient({ cwd: this.cwd })
      await installWithNpmClient({
        npmClient,
        cwd: this.cwd,
      })

      logger.info(`依赖已通过 ${npmClient} 成功安装`)
    } catch (error) {
      throw new Error(`安装依赖失败: ${error}`)
    }
  }

  public getDependencies(): Dependencies {
    return this.packageJson.dependencies || {}
  }

  public getDevDependencies(): Dependencies {
    return this.packageJson.devDependencies || {}
  }

  public hasDependency(name: string): boolean {
    const deps = this.getDependencies()
    const devDeps = this.getDevDependencies()
    return name in deps || name in devDeps
  }

  public getDependency(name: string) {
    const deps = this.getDependencies()
    const devDeps = this.getDevDependencies()
    return deps[name] || devDeps[name]
  }

  private addScriptToPkg(name: string, cmd: string) {
    this.packageJson.scripts = this.packageJson.scripts || {}
    this.packageJson.scripts[name] = cmd
  }

  /**
   * package.json 中增加命令
   * @param name 命令名称
   * @param cmd 执行命令
   */
  public addScript(name: string, cmd: string) {
    this.addScriptToPkg(name, cmd)
    logger.info('Update package.json for scripts')
  }

  /**
   * package.json 中增加多个命令
   * @param scripts 命令对象
   */
  public addScripts(scripts: { [script: string]: string }) {
    Object.entries(scripts).forEach(([name, cmd]) =>
      this.addScriptToPkg(name, cmd),
    )
    logger.info('Update package.json for scripts')
  }
}
