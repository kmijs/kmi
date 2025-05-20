import os from 'node:os'
import path from 'node:path'
import { isLinux } from '../compiled/std-env'

export const ENTRY_JS = 'kmi.ts'

export const DEFAULT_BROWSER_TARGETS = {
  chrome: 80,
  safari: 11,
  firefox: 78,
  edge: 88,
}

export const FRAMEWORK_NAME = process.env.FRAMEWORK_NAME || 'kmi'

export const CACHE_DIR_NAME = '.cache'

export const RegistryURL = 'https://registry.npmjs.org'

export const KMI_HOME_DIR =
  process.env.KMI_HOME || path.join(os.homedir(), '.kmi')

export const IS_KCI = isLinux && process.env.KCI_PIPELINE_NAME

export const DEFAULT_DEV_HOST = '0.0.0.0'

// 云 ide 环境
export const IS_CLOUDDEV = process.env.CLOUDDEV_CONTAINER === '1'

// 全局配置目录
export const HOME_DIR = process.env.KMI_HOME || path.join(os.homedir(), '.kmi')

// 云开发机
export const IS_CLOUD_KWS = isLinux && os.hostname().endsWith('dev.kwaidc.com')

// 电商流程命令
export const ES_FLOW_COMMANDS = [
  'add',
  'init',
  'branch',
  'br',
  'publish',
  'p',
  'doc',
  'test',
  'merge',
  'st',
  'check',
  'push',
  'login',
  'l',
  'open',
  'op',
]
