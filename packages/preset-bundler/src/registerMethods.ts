import type { IApi } from 'umi'

export default (api: IApi): void => {
  api.describe({
    key: 'preset-bundler:registerMethods',
  })
  ;[
    // rspack additional
    'addExtraSwcPlugins',
    'modifySwcLoaderOptions',
    'modifyRspackBabelLoaderOptions',
    'modifyBundlerConfig',
    'bundlerChain',
    'onBeforeCreateCompiler',
    'onAfterCreateCompiler',
    'addBabelPresets',
  ].forEach((name) => {
    api.registerMethod({ name })
  })
}
