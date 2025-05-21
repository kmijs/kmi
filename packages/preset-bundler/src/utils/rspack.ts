import type { IApi } from 'umi'

export async function getSwcOpts(opts: { api: IApi }) {
  const extraSwcPlugins = await opts.api.applyPlugins({
    key: 'addExtraSwcPlugins',
    initialValue: [],
  })

  const modifySwcLoaderOptions = async (memo: any, args: Record<string, any>) =>
    opts.api.applyPlugins({
      key: 'modifySwcLoaderOptions',
      initialValue: memo,
      args,
    })

  return {
    extraSwcPlugins,
    modifySwcLoaderOptions,
  }
}
