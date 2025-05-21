import type { IApi } from 'umi'

export async function getBabelOpts(opts: { api: IApi }) {
  const babelPreset = await opts.api.applyPlugins({
    key: 'addBabelPresets',
    initialValue: [],
  })

  const extraBabelPresets = await opts.api.applyPlugins({
    key: 'addExtraBabelPresets',
    initialValue: [],
  })

  const extraBabelPlugins = await opts.api.applyPlugins({
    key: 'addExtraBabelPlugins',
    initialValue: [],
  })

  const beforeBabelPresets = await opts.api.applyPlugins({
    key: 'addBeforeBabelPresets',
    initialValue: [],
  })

  const beforeBabelPlugins = await opts.api.applyPlugins({
    key: 'addBeforeBabelPlugins',
    initialValue: [],
  })

  return {
    babelPreset,
    extraBabelPlugins,
    extraBabelPresets,
    beforeBabelPresets,
    beforeBabelPlugins,
  }
}
