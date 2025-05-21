import type { IApi } from '@kmijs/types'

const SVG_REGEX = /\.svg$/

export default (api: IApi) => {
  api.describe({
    key: '@kmijs/plugin-svgr:svgo',
  })

  api.bundlerChain((memo) => {
    // 提前返回,避免不必要的处理
    if (!api.config.svgo) return memo

    const { svgo } = api.config

    const svgRule = memo.module.rule('svgo')
    svgRule
      .test(SVG_REGEX)
      .use('svgo-loader')
      .loader(require.resolve('../compiled/svgo-loader'))
      .options({
        configFile: false,
        ...svgo,
      })

    return memo
  })
}
