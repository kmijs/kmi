import path from 'node:path'
import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'codeInspector',
    config: {
      schema({ zod }) {
        return zod
          .record(zod.string(), zod.any())
          .describe(
            '开启点击页面上的 DOM 元素，它能自动打开 IDE 并将光标定位至 DOM 的源代码位置',
          )
      },
    },
    enableBy: api.EnableBy.config,
  })

  api.bundlerChain((memo) => {
    if (api.name !== 'dev') {
      return memo
    }

    const CodeInspectorPlugin = require('../compiled/webpack-code-inspector-plugin')
    memo.plugin('code-inspector-plugin').use(CodeInspectorPlugin, [
      {
        bundler: api.appData.bundler,
        close: false,
        output: path.resolve(__dirname, './'),
        ...api.config.codeInspector,
      },
    ])
    return memo
  })
}
