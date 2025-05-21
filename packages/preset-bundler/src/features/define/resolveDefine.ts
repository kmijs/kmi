import { ERROR_CODE } from '@kmijs/shared'

interface IOpts {
  userConfig: Record<string, any>
  bundler: string
  isDev: boolean
  isProd: boolean
  host?: string
  port?: number
}

const prefixRE = /^KMI_APP_/
// 兼容 UMI
const prefixREByUmi = /^UMI_APP_/
const ENV_SHOULD_PASS = ['NODE_ENV', 'HMR', 'SOCKET_SERVER', 'ERROR_OVERLAY']
const SOCKET_IGNORE_HOSTS = ['0.0.0.0', '127.0.0.1', 'localhost']
const processEnvRE = /^process\.env\./
// 环境变量传递自定义逻辑，默认直接透传
const CUSTOM_ENV_GETTER: Record<string, (opts: IOpts) => string | undefined> = {
  SOCKET_SERVER: (opts: IOpts) => {
    const { userConfig, host, port } = opts
    const socketServer = process.env.SOCKET_SERVER
    // 如果当前有 process.env.SOCKET_SERVER，则使用当前值
    if (socketServer) {
      return socketServer
    }
    // 如果当前无 process.env.SOCKET_SERVER
    // 则判断是否有 process.env.HOST 且不为 0.0.0.0/127.0.0.1/localhost
    // 多域名切换 用户可能打开的还是老的地址, 这时  https 无效 可能会导致 socket 连接失败
    if (host && !SOCKET_IGNORE_HOSTS.includes(host) && !userConfig.https) {
      const protocol = userConfig.https ? 'https:' : 'http:'
      return `${protocol}//${host}:${port || 8000}`
    }
    return
  },
}

export function resolveDefine(opts: IOpts) {
  const { userConfig, bundler, isDev, isProd } = opts
  const env: Record<string, any> = {}
  // 带 KMI_APP_ UMI_APP_ 前缀的和 ENV_SHOULD_PASS 定义的环境变量需要透传
  ENV_SHOULD_PASS.concat(
    Object.keys(process.env).filter((k) => {
      return prefixRE.test(k) || prefixREByUmi.test(k)
    }),
  ).forEach((key: string) => {
    const envValue = CUSTOM_ENV_GETTER[key]
      ? CUSTOM_ENV_GETTER[key](opts)
      : process.env[key]
    if (typeof envValue === 'undefined') {
      return
    }
    env[key] = envValue
  })

  // 如果不存在 给默认值
  env.KMI_ENV = process.env.KMI_ENV || 'local'
  env.BASE_URL = userConfig.base || '/'

  // Useful for resolving the correct path to static assets in `public`.
  // For example, <img src={process.env.PUBLIC_PATH + '/img/logo.png'} />.
  // TODO PUBLIC_PATH 会导致 CDN 容灾误判、rspack 不在提供 PUBLIC_PATH 可以使用 window.publicPath 或者 window.cdn_public_path 代替
  // env.PUBLIC_PATH = userConfig.publicPath || '/';

  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }

  const define: Record<string, any> = {}
  if (userConfig.define) {
    for (const key in userConfig.define) {
      if (key === 'process.env') {
        throw new Error(
          `${ERROR_CODE.PROCESS_ENV_NOT_ALLOWED} define 中不允许直接定义 process.env, 如需定义请使用 process.env.XXX 代替`,
        )
      }
      if (processEnvRE.test(key)) {
        const envKey = key.replace(processEnvRE, '')
        env[envKey] = JSON.stringify(userConfig.define[key])
      } else {
        define[key] = JSON.stringify(userConfig.define[key])
      }
    }
  }

  return {
    'process.env': env,
    'process.env.SSR_MANIFEST': 'process.env.SSR_MANIFEST',
    'process.env.KMI_BUNDLER': JSON.stringify(bundler),
    'import.meta.env.DEV': JSON.stringify(isDev),
    'import.meta.env.PROD': JSON.stringify(isProd),
    ...define,
  }
}
