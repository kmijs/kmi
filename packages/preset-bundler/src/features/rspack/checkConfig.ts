import { lodash, logger, picocolors } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'

// Configuration items that are not supported and will directly report an error
const unsupportedKeys = [
  // not support mfsu
  'mfsu',
  // not support deadCode
  'deadCode',
  // not support checkDepCssModules
  'checkDepCssModules',
]

export function applyCheckConfig(api: IApi) {
  api.onCheckConfig(() => {
    unsupportedKeys.forEach((key) => {
      if (api.userConfig[key]) {
        throw new Error(
          `rspack does not support the ${picocolors.red(
            key,
          )} configuration item`,
        )
      }
    })

    // Configuration items that affect performance or have duplicate capabilities
    const lowKeys = ['extraBabelPlugins', 'extraBabelPresets']
    lowKeys.forEach((key) => {
      if (api.userConfig[key]) {
        logger.warn(
          picocolors.yellow(
            `Rspack mode enabled ${key} configuration references additional babel compilation, which will affect build performance. Please use with caution`,
          ),
        )
      }
    })

    const warningKeys = []

    const riskyKeys = ['config.autoprefixer']

    riskyKeys.forEach((key) => {
      if (lodash.get(api.userConfig, key)) {
        warningKeys.push(
          `Rspack mode does not support configuration item ${key
            .split('.')
            .pop()}`,
        )
      }
    })

    if (
      api.userConfig.jsMinifier &&
      ['uglifyJs'].includes(api.userConfig.jsMinifier)
    ) {
      warningKeys.push(`jsMinifier 配置项不支持 ${api.userConfig.jsMinifier}`)
    }

    if (
      api.userConfig.cssMinifier &&
      ['parcelCSS'].includes(api.userConfig.cssMinifier)
    ) {
      warningKeys.push(`cssMinifier 配置项不支持 ${api.userConfig.cssMinifier}`)
    }

    if (
      api.userConfig.srcTranspiler &&
      ['babel', 'esbuild'].includes(api.userConfig.srcTranspiler)
    ) {
      warningKeys.push(
        `srcTranspiler 配置不支持 ${api.userConfig.srcTranspiler}`,
      )
    }

    if (warningKeys.length) {
      console.warn(
        picocolors.yellow(
          `
  =====================================================================================================

     █████   ███   █████   █████████   ███████████   ██████   █████ █████ ██████   █████   █████████
    ░░███   ░███  ░░███   ███░░░░░███ ░░███░░░░░███ ░░██████ ░░███ ░░███ ░░██████ ░░███   ███░░░░░███
     ░███   ░███   ░███  ░███    ░███  ░███    ░███  ░███░███ ░███  ░███  ░███░███ ░███  ███     ░░░
     ░███   ░███   ░███  ░███████████  ░██████████   ░███░░███░███  ░███  ░███░░███░███ ░███
     ░░███  █████  ███   ░███░░░░░███  ░███░░░░░███  ░███ ░░██████  ░███  ░███ ░░██████ ░███    █████
      ░░░█████░█████░    ░███    ░███  ░███    ░███  ░███  ░░█████  ░███  ░███  ░░█████ ░░███  ░░███
        ░░███ ░░███      █████   █████ █████   █████ █████  ░░█████ █████ █████  ░░█████ ░░█████████
         ░░░   ░░░      ░░░░░   ░░░░░ ░░░░░   ░░░░░ ░░░░░    ░░░░░ ░░░░░ ░░░░░    ░░░░░   ░░░░░░░░░


    Kmi Rspack mode does not support the following configuration items:
      - ${warningKeys.join('\n    - ')}

    Unsupported configurations may cause the project to fail to compile or run at runtime. Please ${picocolors.bold(
      'test and publish with caution',
    )}.
  =====================================================================================================
        `,
        ),
      )
    }
  })
}
