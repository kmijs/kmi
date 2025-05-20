import { DEFAULT_WEB_BROWSERSLIST } from '../constants'

export function getESVersion(browserslist: string[]) {
  // 单侧跑 await import 时，会报错，所以这里跳过
  if (process.env.KMI_CLI_TEST) {
    return 'es2017'
  }

  // skip calculation if the browserslist is the default value
  if (browserslist.join(',') === DEFAULT_WEB_BROWSERSLIST.join(',')) {
    return 'es2017'
  }

  return `browserslist:${browserslist.join(',')}` as const
}
