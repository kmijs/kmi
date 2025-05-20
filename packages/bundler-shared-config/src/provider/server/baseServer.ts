import { createReadStream, existsSync } from 'node:fs'
import http from 'node:http'
import { extname, join } from 'node:path'
import {
  createHttpsServer,
  createProxy,
  getFirstStats,
} from '@kmijs/bundler-shared'
// @ts-expect-error
import cors from '@kmijs/bundler-shared/compiled/cors'
import express from '@kmijs/bundler-shared/compiled/express'
import type { Stats, StatsCompilation } from '@kmijs/bundler-shared/rspack'
import { MultiStats } from '@kmijs/bundler-shared/rspack'
import {
  DEFAULT_DEV_HOST,
  getDevBanner,
  lodash,
  logger,
  openKmiUrl,
} from '@kmijs/shared'
import { MESSAGE_TYPE } from '../../constants'
import type { IBaseCreateServerOpts } from '../types'
import { isCliShortcutsEnabled, setupCliShortcuts } from './cliShortcuts'
import { onCompileDone } from './utils/onCompileDone'
import { createWebSocketServer } from './ws'

export async function createBaseServer(opts: IBaseCreateServerOpts) {
  logger.verbose('[createBaseServer] opts', opts)
  const { userConfig, onBeforeMiddleware, beforeMiddlewares } = opts
  const { proxy } = userConfig

  let app = express()

  if (userConfig.https?.http2) {
    const http2Express = require('@kmijs/bundler-compiled/compiled/http2-express')
    app = http2Express(express)
  }

  // ws 需要提前初始化
  // 避免在 https 模式下时「Cannot access 'ws' before initialization」的报错
  // biome-ignore lint/style/useConst: <explanation>
  let ws: ReturnType<typeof createWebSocketServer>

  // cros
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'HEAD', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    }),
  )

  if (process.env.KMI_DEV_SERVER_COMPRESS !== 'none') {
    app.use(require('@kmijs/bundler-shared/compiled/@polka/compression')())
  }

  // debug all js file
  app.use((req, res, next) => {
    const file = req.path
    const filePath = join(opts.cwd, file)
    const ext = extname(filePath)

    if (ext === '.js' && existsSync(filePath)) {
      logger.info(
        '[dev]',
        `${file} is responded with ${filePath}, remove it to use original file`,
      )
      res.sendFile(filePath)
    } else {
      next()
    }
  })

  // Provides the ability to execute custom middleware prior to all other middleware internally within the server.
  if (onBeforeMiddleware) {
    onBeforeMiddleware(app)
  }

  // before middlewares
  ;(beforeMiddlewares || []).forEach((m) => app.use(m))

  const compiler = opts.createCompiler(opts)

  // TODO 进度条处理、在 createCompiler 中去处理
  const webpackDevMiddleware = require('@kmijs/bundler-compiled/compiled/webpack-dev-middleware')
  const compilerMiddleware = webpackDevMiddleware(compiler, {
    publicPath: userConfig.publicPath || '/',
    writeToDisk: userConfig.writeToDisk,
    stats: false,
    // etag: 'weak',
  })

  app.use(compilerMiddleware)

  // hmr hooks
  let stats: Stats | MultiStats
  let isFirstCompile = true

  onCompileDone(
    compiler,
    async (_stats: Stats | MultiStats) => {
      stats = _stats
      // 获取第一个编译统计信息（默认优先）
      const compilationStats = getFirstStats(stats)
      const compilationTime =
        compilationStats.endTime && compilationStats.startTime
          ? compilationStats.endTime - compilationStats.startTime
          : 0

      // 发送统计信息到客户端
      sendStats(getStats(stats))

      // 触发编译完成回调
      opts.onDevCompileDone?.({
        stats,
        isFirstCompile,
        time: compilationTime,
      })

      // 更新编译状态标志
      isFirstCompile = false
    },
    MultiStats,
  )

  function sendStats(stats: StatsCompilation, force?: boolean, sender?: any) {
    const shouldEmit =
      !force &&
      stats &&
      (!stats.errors || stats.errors.length === 0) &&
      (!stats.warnings || stats.warnings.length === 0) &&
      stats.assets &&
      stats.assets.every((asset) => !asset.emitted)
    if (shouldEmit) {
      sendMessage(MESSAGE_TYPE.stillOk, null, sender)
      return
    }
    sendMessage(MESSAGE_TYPE.hash, stats.hash, sender)
    if (
      (stats.errors && stats.errors.length > 0) ||
      (stats.warnings && stats.warnings.length > 0)
    ) {
      if (stats.warnings && stats.warnings.length > 0) {
        sendMessage(MESSAGE_TYPE.warnings, stats.warnings, sender)
      }
      if (stats.errors && stats.errors.length > 0) {
        sendMessage(MESSAGE_TYPE.errors, stats.errors, sender)
      }
    } else {
      sendMessage(MESSAGE_TYPE.ok, null, sender)
    }
  }

  function getStats(stats: Stats | MultiStats) {
    return stats.toJson({
      all: false,
      hash: true,
      assets: true,
      warnings: true,
      errors: true,
      errorDetails: false,
      moduleTrace: true,
      preset: 'errors-warnings',
    })
  }

  function sendMessage(type: string, data?: any, sender?: any) {
    ;(sender || ws)?.send(JSON.stringify({ type, data }))
  }

  // proxy
  if (proxy) {
    createProxy(proxy, app)
  }

  // after middlewares
  ;(opts.afterMiddlewares || []).forEach((m) => {
    // @ts-expect-error
    app.use(m.toString().includes('{ compiler }') ? m({ compiler }) : m)
  })

  // history fallback
  app.use(
    require('@kmijs/bundler-shared/compiled/connect-history-api-fallback')({
      index: '/',
    }),
  )

  // hmr reconnect ping
  app.use('/__kmi_ping', (_, res) => {
    res.end('pong')
  })

  // index.html
  // TODO: remove me
  app.get('/', (_req, res, next) => {
    res.set('Content-Type', 'text/html')
    const htmlPath = join(opts.cwd, 'index.html')
    if (existsSync(htmlPath)) {
      createReadStream(htmlPath).on('error', next).pipe(res)
    } else {
      next()
    }
  })

  let server: http.Server | Awaited<ReturnType<typeof createHttpsServer>>
  if (userConfig.https) {
    const httpsOpts = userConfig.https
    if (!httpsOpts.hosts) {
      httpsOpts.hosts = lodash.uniq(
        [
          ...(httpsOpts.hosts || []),
          // always add localhost, 127.0.0.1, ip and host
          '127.0.0.1',
          'localhost',
          DEFAULT_DEV_HOST,
          opts.ip,
          opts.host !== DEFAULT_DEV_HOST && opts.host,
        ].filter(Boolean) as string[],
      )
    }
    server = await createHttpsServer(app, httpsOpts)
  } else {
    server = http.createServer(app)
  }
  if (!server) {
    return null
  }

  ws = createWebSocketServer(server)

  ws.wss.on('connection', (socket) => {
    if (stats) {
      sendStats(getStats(stats), false, socket)
    }
  })

  const protocol = userConfig.https ? 'https:' : 'http:'
  const port = opts.port || 8000

  const cliShortcutsEnabled = isCliShortcutsEnabled()

  const printUrls = () => {
    const banner = getDevBanner({
      protocol,
      host: opts.host,
      port,
    })

    console.log(banner.before)
    logger.ready(banner.main)
    console.log(banner.after)
  }

  server.listen(port, async () => {
    // 打印服务启动的 URL 信息
    printUrls()

    const defaultHost = opts.host || DEFAULT_DEV_HOST

    const serverOpts = {
      protocol,
      port,
      host: defaultHost,
      open: userConfig.server?.open,
    }
    await opts.onAfterStartDevServer?.(serverOpts)

    // 设置命令行快捷键
    if (cliShortcutsEnabled) {
      const shortcuts = {
        help: true,
        openPage: async () => {
          await openKmiUrl(serverOpts)
        },
        closeServer: async () => {
          process.emit('KMI_CLI_SHORTCUT_CLOSE_SERVER' as any)
          await server.close()
        },
        printUrls,
      }
      setupCliShortcuts(shortcuts)
    }
  })

  return server
}
