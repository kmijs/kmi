import { existsSync, readJSONSync } from '../compiled/fs-extra'
import lodash from '../compiled/lodash'
import { dirname, join } from '../compiled/pathe'
import type yParser from '../compiled/yargs-parser'
import * as logger from './logger'

interface CmdArgConfig {
  name: string
  alias: string
  default?: string | boolean | number
  desc?: string
}

interface CommandOpts {
  name: string
  description?: string
  options?: string
  details?: string
  noAuth?: boolean // No token login required, e.g., -h, -v, login, etc.
  fn: ({ args }: { args: yParser.Arguments }) => void | Promise<void>
}

type CmdConfig = Partial<
  Omit<CommandOpts, 'fn'> & { alias: string; args: CmdArgConfig[] }
>

function getCmdJsonConfig(name: string, pkgPath: string) {
  let cmdJsonConfig: CmdConfig = {}
  // cmd.json需与 entry同级
  const cmdPath = join(dirname(pkgPath), 'dist', 'cmd.json')
  if (existsSync(cmdPath)) {
    const allConfig = readJSONSync(cmdPath) as Record<string, CmdConfig>
    if (!allConfig[name]) {
      logger.debug(`Empty command【${name}】config in cmd.json, ignored`)
    } else {
      cmdJsonConfig = allConfig[name]
    }
  }
  return cmdJsonConfig
}

/**
 * @name 获取args的值
 * @description 根据`cmd.json`获取args，默认deleteAlias为true, 删除alias后提高args可读性
 */
export function getArgsValueAndAlias(
  args: any,
  cmd: string,
  pkgPath: string,
  deleteAlias = true,
) {
  const cmdArgs: CmdArgConfig[] = getCmdJsonConfig(cmd, pkgPath).args || []
  const defaultValues = cmdArgs.reduce(
    (p, c) => {
      p[c.name] = c.default
      return p
    },
    {} as Record<string, any>,
  )
  const _args = Object.assign({}, defaultValues, lodash.cloneDeep(args))
  cmdArgs.forEach((item) => {
    const list: string[] = [item.name]
    if (item.alias) list.push(...item.alias.split(','))
    while (list.length) {
      const k = list.shift() as string
      if (k && _args[k]) {
        const val =
          typeof item.default === 'boolean' && _args[k] === 'false'
            ? false
            : _args[k]
        _args[item.name] = val
        if (args[k]) args[item.name] = val // 给args设置全名
        if (deleteAlias && item.name !== k) {
          delete _args[k]
          if (args[k]) delete args[k] // 移除args的alias属性
        }
      }
    }
  })
  return _args
}
