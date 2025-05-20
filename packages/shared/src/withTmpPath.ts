import { join } from '../compiled/pathe'

export function withTmpPath(opts: {
  //  引入 @kmijs/types 会造成循环依赖
  api: any
  path: string
  noPluginDir?: boolean
}) {
  return join(
    opts.api.paths.absTmpPath,
    opts.api.plugin.key && !opts.noPluginDir
      ? `plugin-${opts.api.plugin.key}`
      : '',
    opts.path,
  )
}
