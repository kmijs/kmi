import { createDependenciesRegExp } from '@kmijs/shared'

export default {
  rspack: {},
  hash: false,
  codeSplitting: {
    jsStrategy: 'granularChunks',
    jsStrategyOptions: {
      forceSplitting: {
        'lib-plots': createDependenciesRegExp('@ant-design/plots'),
        'lib-antd': createDependenciesRegExp('antd'),
      },
    },
  },
}
