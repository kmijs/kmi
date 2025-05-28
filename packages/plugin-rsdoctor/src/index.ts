import { DownloadNpm } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'

export default (api: IApi) => {
  api.describe({
    key: 'rsdoctor',
    config: {
      schema({ zod }) {
        return zod.object({}).describe('rsdoctor 配置通过 RSDOCTOR=1 开启')
      },
    },
    enableBy() {
      return process.env.RSDOCTOR === '1'
    },
  })

  api.bundlerChain(async (memo) => {
    const isRspack = api.appData.bundler === 'rspack'
    const pluginPackage = isRspack
      ? '@rsdoctor/rspack-plugin@1.0.0'
      : '@rsdoctor/webpack-plugin@1.0.0'

    const downloadNpm = new DownloadNpm({
      value: pluginPackage,
      force: api.args?.force,
    })

    api.logger.event('正在下载 Rsdoctor 插件依赖...')
    const rsdoctorPath = await downloadNpm.getNpmFile()
    const { RsdoctorRspackPlugin, RsdoctorWebpackPlugin } = require(
      rsdoctorPath,
    )

    // 默认配置与用户配置合并
    const rsdoctorConfig = {
      experiments: { enableNativePlugin: true },
      features: ['loader', 'plugins', 'bundle'],
      generateTileGraph: true,
      disableTOSUpload: true,
      port: 7430,
      linter: {
        rules: {
          'ecma-version-check': 'off',
        },
      },
      ...api.config.rsdoctor,
    }

    const RsdoctorPlugin = isRspack
      ? RsdoctorRspackPlugin
      : RsdoctorWebpackPlugin
    memo.plugin('rsdoctor').use(RsdoctorPlugin, [rsdoctorConfig])
    return memo
  })
}
