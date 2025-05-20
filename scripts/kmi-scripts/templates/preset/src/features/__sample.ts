import { defineKmiPlugin } from '@kmijs/kmijs'

export default defineKmiPlugin({
  apply: ['setup', 'dev', 'build'],
  describe: {
    key: 'preset-sample:sample',
  },
  setup(api) {
    // 这里写插件内容...
  },
})
