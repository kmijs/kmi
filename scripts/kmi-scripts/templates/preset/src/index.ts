import type { IApi } from '@kmijs/kmijs'

export default (api: IApi): { plugins: string[] } => {
  return {
    plugins: [
      // ❀ 这里引入插件
      require.resolve('./features/demo/demo'),
    ].filter(Boolean) as string[],
  }
}
