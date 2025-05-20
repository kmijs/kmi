import { Env, type FilenameConfig, type SharedConfigOptions } from '../types'

export function getFilename(
  config: SharedConfigOptions,
  type: 'js' | 'jsAsync',
): NonNullable<FilenameConfig['js']> | NonNullable<FilenameConfig['jsAsync']>
export function getFilename(
  config: SharedConfigOptions,
  type: 'css' | 'cssAsync',
): NonNullable<FilenameConfig['css']> | NonNullable<FilenameConfig['cssAsync']>
export function getFilename(
  config: SharedConfigOptions,
  type: Exclude<keyof FilenameConfig, 'js' | 'css' | 'jsAsync' | 'cssAsync'>,
): string
export function getFilename(
  config: SharedConfigOptions,
  type: keyof FilenameConfig,
) {
  const { useHash, userConfig, env } = config
  const { filename = {} } = userConfig
  const isProd = env === Env.production

  const getHash = () => {
    return useHash ? '.[contenthash:8]' : ''
  }

  const hash = getHash()

  switch (type) {
    case 'js':
      return filename.js ?? `[name]${isProd ? hash : ''}.js`
    case 'jsAsync':
      return filename.jsAsync ?? `[name]${isProd ? hash : ''}.async.js`
    case 'css':
      return filename.css ?? `[name]${isProd ? hash : ''}.css`
    case 'cssAsync':
      return filename.cssAsync ?? `[name]${isProd ? hash : ''}.async.css`
    case 'svg':
      return filename.svg ?? `[name]${hash}.svg`
    case 'font':
      return filename.font ?? `[name]${hash}[ext]`
    case 'image':
      return filename.image ?? `[name]${hash}[ext]`
    case 'media':
      return filename.media ?? `[name]${hash}[ext]`
    case 'assets':
      return filename.assets ?? `[name]${hash}[ext]`
    default:
      throw new Error(`[kmi] 在 "filename" 中发现未知的 key: ${type}`)
  }
}
