import type { Options as HPMOptions } from '../compiled/http-proxy-middleware'

export interface HttpsServerOptions {
  key?: string
  cert?: string
  hosts?: string[] // 默认值 ['localhost', '127.0.0.1']
  http2?: boolean
  /**
   * 证书输出路径
   */
  outputPath?: string
}

type HPMFnArgs = Parameters<NonNullable<HPMOptions['onProxyReq']>>
export interface ProxyOptions extends HPMOptions {
  target?: string
  context?: string | string[]
  bypass?: (
    ...args: [HPMFnArgs[1], HPMFnArgs[2], HPMFnArgs[3]]
  ) => string | boolean | null | void
}

export type KmiTarget = 'web' | 'node' | 'web-worker'
