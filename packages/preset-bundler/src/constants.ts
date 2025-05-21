import { dirname } from 'node:path'

export const NODE_MODULES_REGEX: RegExp = /[\\/]node_modules[\\/]/

export const CORE_JS_DIR = dirname(require.resolve('core-js/package.json'))
