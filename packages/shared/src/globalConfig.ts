import path from 'node:path'
import fs from '../compiled/fs-extra'
import type { Low } from '../compiled/lowdb'
import { HOME_DIR } from './constants'

const KMI_GLOBAL_CONFIG_PATH = path.join(HOME_DIR, 'k-global-config.json')

interface IGlobalConfig {
  solution?: string
}

export class GlobalConfig {
  private db?: Low<IGlobalConfig>

  private async getInstance() {
    if (this.db) {
      return this.db
    }
    // fix 目录不存在的情况
    fs.ensureDir(HOME_DIR)
    const { JSONFilePreset } = await import('../compiled/lowdb/index.js')
    this.db = await JSONFilePreset<IGlobalConfig>(KMI_GLOBAL_CONFIG_PATH, {})
    return this.db
  }

  async readConfig() {
    const db = await this.getInstance()
    await db.read()
    return db.data
  }

  async get(key: keyof IGlobalConfig) {
    const config = await this.readConfig()
    return config[key]
  }

  async writeConfig(config: IGlobalConfig) {
    const db = await this.getInstance()
    db.data = {
      ...db.data,
      ...config,
    }
    await db.write()
  }
}

export const globalConfig = new GlobalConfig()
