export const DEFAULT_DEVTOOL = 'cheap-module-source-map'

export enum MESSAGE_TYPE {
  ok = 'ok',
  warnings = 'warnings',
  errors = 'errors',
  hash = 'hash',
  stillOk = 'still-ok',
  invalid = 'invalid',
}

// Extensions
export const FONT_EXTENSIONS: string[] = [
  'woff',
  'woff2',
  'eot',
  'ttf',
  'otf',
  'ttc',
]
export const IMAGE_EXTENSIONS: string[] = [
  'png',
  'jpg',
  'jpeg',
  'pjpeg',
  'pjp',
  'gif',
  'bmp',
  'webp',
  'ico',
  'apng',
  'avif',
  'tif',
  'tiff',
  'jfif',
  'cur',
]
export const VIDEO_EXTENSIONS: string[] = ['mp4', 'webm', 'ogg', 'mov']
export const AUDIO_EXTENSIONS: string[] = [
  'mp3',
  'wav',
  'flac',
  'aac',
  'm4a',
  'opus',
]

export const JS_DIST_DIR = 'js'
export const CSS_DIST_DIR = 'css'
export const SVG_DIST_DIR = 'static/svg'
export const FONT_DIST_DIR = 'static/font'
export const WASM_DIST_DIR = 'static/wasm'
export const IMAGE_DIST_DIR = 'static/image'
export const MEDIA_DIST_DIR = 'static/media'
export const ASSETS_DIST_DIR = 'static/assets'

export const DEFAULT_ESBUILD_TARGET_KEYS = [
  'chrome',
  'firefox',
  'edge',
  'safari',
]

export const DEFAULT_WEB_BROWSERSLIST: string[] = [
  'chrome >= 80',
  'edge >= 88',
  'firefox >= 78',
  'safari >= 11',
]
