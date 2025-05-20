import { dirname, join } from 'node:path'
import readline from 'node:readline'
import fsExtra from '../compiled/fs-extra'
import chalk from '../compiled/picocolors'
import { pkgUpSync } from '../compiled/pkg-up'
import { KMI_HOME_DIR } from './constants'
import { importLazy } from './importLazy'

const enableFSLogger =
  process.env.FS_LOGGER !== 'none' && !process.versions.webcontainer

const loggerDir = findLoggerDir()
const loggerPath = join(loggerDir, 'kmi.log')

const pinoModule: typeof import('pino') = importLazy(require.resolve('pino'))

export const prefixes = {
  wait: `${chalk.cyan('wait')}  -`,
  error: `${chalk.red('error')} -`,
  warn: `${chalk.yellow('warn')}  -`,
  ready: `${chalk.green('ready')} -`,
  info: `${chalk.cyan('info')}  -`,
  event: `${chalk.magenta('event')} -`,
  debug: `${chalk.gray('debug')} -`,
  profile: `${chalk.blue('profile')} -`,
  fatal: `${chalk.red('fatal')} -`,
  verbose: `${chalk.magenta('verbose')} -`,
  log: '      -',
}

let logger: any
if (enableFSLogger) {
  const pino = pinoModule.default
  fsExtra.mkdirpSync(loggerDir)
  const customLevels = {
    ready: 31,
    event: 32,
    wait: 55,
    // 虽然这里设置了 debug 为 30，但日志中还是 20，符合预期
    // 这里不加会不生成到 kmi.log，transport 的 level 配置没有生效，原因不明
    debug: 30,
    verbose: 33,
  }
  logger = pino(
    {
      customLevels,
    },
    pino.transport({
      targets: [
        {
          target: require.resolve('pino/file'),
          options: {
            destination: loggerPath,
          },
          level: 'trace',
        },
      ],
    }),
  )
} else {
  logger = {}
  Object.keys(prefixes).forEach((key) => {
    logger[key] = () => {}
  })
}

export function wait(...message: any[]): void {
  console.log(prefixes.wait, ...message)
  logger.wait(message[0])
}

export function error(...message: any[]): void {
  console.error(prefixes.error, ...message)
  logger.error(message[0])
}

export function warn(...message: any[]): void {
  console.warn(prefixes.warn, ...message)
  logger.warn(message[0])
}

export function ready(...message: any[]): void {
  console.log(prefixes.ready, ...message)
  logger.ready(message[0])
}

export function info(...message: any[]): void {
  console.log(prefixes.info, ...message)
  logger.info(message[0])
}

export function event(...message: any[]): void {
  console.log(prefixes.event, ...message)
  logger.event(message[0])
}

export function debug(...message: any[]): void {
  if (process.env.DEBUG) {
    console.log(prefixes.debug, ...message)
  }
  logger.debug(message[0])
}

export function fatal(...message: any[]): void {
  console.error(prefixes.fatal, ...message)
  logger.fatal(message[0])
}

export function verbose(...message: any[]): void {
  if (process.env.KMI_VERBOSE) {
    console.log(prefixes.verbose, ...message)
  }
  logger.verbose(message)
}

export function log(...message: any[]): void {
  console.log(prefixes.log, ...message)
}

export function clearScreen() {
  if (process.stdout.isTTY && !process.env.CI) {
    const repeatCount = process.stdout.rows - 2
    const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}

// 仅上报错误使用
export function verboseError(...message: any[]): void {
  logger.error(message)
}

const profilers: Record<string, { startTime: number }> = {}

export function profile(id: string, ...message: any[]): void {
  // Worker logs only available in debug mode
  if (process.env.IS_KMI_BUILD_WORKER && !process.env.DEBUG) {
    return
  }
  if (!profilers[id]) {
    profilers[id] = {
      startTime: Date.now(),
    }
    console.log(prefixes.profile, chalk.green(id), ...message)
    return
  }
  const endTime = Date.now()
  const { startTime } = profilers[id]
  console.log(
    prefixes.profile,
    chalk.green(id),
    `Completed in ${chalk.cyan(`${endTime - startTime}ms`)}`,
    ...message,
  )
  delete profilers[id]
}

export function getLatestLogFilePath() {
  return enableFSLogger ? loggerPath : null
}

function findLoggerDir() {
  let baseDir = process.cwd()
  const pkg = pkgUpSync({ cwd: baseDir })
  if (pkg) {
    baseDir = dirname(pkg)
    return join(baseDir, 'node_modules/.cache/logger')
  }

  // 如果找不到 pkg 则不认为是在项目中，全局目录
  return join(KMI_HOME_DIR, process.env.KMI_G_CLI ?? '@kmijs/cli', 'logger')
}
