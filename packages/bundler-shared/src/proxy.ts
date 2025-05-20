import assert from 'node:assert'
import { logger } from '@kmijs/shared'
import type { Express } from '../compiled/express'
import { createProxyMiddleware } from '../compiled/http-proxy-middleware'
import type { ProxyOptions } from './types'

type ProxyConfig =
  | Record<string, string>
  | Record<string, ProxyOptions>
  | ProxyOptions[]
  | ProxyOptions

function formatProxyOptions(proxyOptions: ProxyConfig) {
  const ret: ProxyOptions[] = []

  if (Array.isArray(proxyOptions)) {
    ret.push(...proxyOptions)
  } else if ('target' in proxyOptions) {
    ret.push(proxyOptions)
  } else {
    for (const [context, options] of Object.entries(proxyOptions)) {
      const opts: ProxyOptions = {
        context,
        changeOrigin: true,
        logLevel: 'warn',
      }
      if (typeof options === 'string') {
        opts.target = options
      } else {
        Object.assign(opts, options)
      }

      // For backwards compatibility reasons.
      if (typeof opts.context === 'string') {
        opts.context = opts.context.replace(/^\*$/, '**').replace(/\/\*$/, '')
      }
      ret.push(opts)
    }
  }

  const handleError = (err: unknown) => logger.error(err)

  for (const opts of ret) {
    opts.onError ??= handleError
  }

  return ret
}

export function createProxy(
  proxy: { [key: string]: ProxyOptions } | ProxyOptions[],
  app: Express,
) {
  // Supported proxy types:
  // proxy: { target, context }
  // proxy: { '/api': { target, context } }
  // proxy: [{ target, context }]
  const proxyArr: ProxyOptions[] = formatProxyOptions(proxy)
  proxyArr.forEach((proxy) => {
    let middleware: any
    if (proxy.target) {
      assert(typeof proxy.target === 'string', 'proxy.target must be string')
      assert(proxy.context, 'proxy.context must be supplied')

      middleware = createProxyMiddleware(proxy.context, {
        ...proxy,
        logProvider() {
          return logger
        },
        onProxyReq(proxyReq, req: any, res) {
          // add origin in request header
          if (proxy.changeOrigin && proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', new URL(proxy.target!)?.origin || '')
          }
          proxy.onProxyReq?.(proxyReq, req, res, proxy)
        },
        // Add x-real-url in response header
        onProxyRes(proxyRes, req: any, res) {
          proxyRes.headers['x-real-url'] =
            new URL(req.url || '', proxy.target as string)?.href || ''
          proxy.onProxyRes?.(proxyRes, req, res)
        },
      })
    }
    app.use((req, res, next) => {
      // Support bypass
      const bypassUrl =
        typeof proxy.bypass === 'function'
          ? proxy.bypass(req, res, proxy)
          : null
      if (typeof bypassUrl === 'string') {
        // byPass to that url
        req.url = bypassUrl
        return next()
      }

      if (bypassUrl === false) {
        return res.end(404)
      }

      if ((bypassUrl === null || bypassUrl === undefined) && middleware) {
        return middleware(req, res, next)
      }

      return next()
    })
  })
}
