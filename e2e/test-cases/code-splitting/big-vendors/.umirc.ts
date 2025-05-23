import { createDependenciesRegExp } from '@kmijs/shared'
export default {
  rspack: {},
  hash: false,
  codeSplitting: {
    jsStrategy: 'bigVendors',
    forceSplitting: {
      antd: createDependenciesRegExp('antd'),
    },
  },
}
