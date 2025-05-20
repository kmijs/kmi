import type { IApi } from '@kmijs/kmijs'

export default (api: IApi) => {
  api.describe({
    key: '@kmijs/{{{ name }}}:preset',
  })

  return {
    // 📢 这里返回需要的集成插件和预设
    plugins: [require.resolve('./features/alias')],
    presets: [],
  }
}
