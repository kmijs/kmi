import Config from '@kmijs/bundler-shared/rspack-chain'
import { stringifyConfig } from '@kmijs/shared'
import { describe, expect, test } from 'vitest'
import { Env, type SharedConfigOptions } from '../../types'
import { applyCss } from './css'

// 模拟 bundler
const mockBundler = {
  CssExtractPlugin: {
    loader: 'mock-css-extract-plugin-loader',
  },
}

const createConfig = (opts: Partial<SharedConfigOptions>) => {
  const config = new Config()
  applyCss({
    cwd: __dirname,
    env: Env.development,
    config,
    bundler: mockBundler,
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 11'],
    ...opts,
  } as unknown as SharedConfigOptions)
  return config.toConfig()
}

describe('css', () => {
  test('应该正确配置基本的CSS规则', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {},
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })

  test('应该在Rspack中默认启用Less多线程编译', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {},
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })

  test('应该能够禁用Less多线程编译', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        rspack: {
          enableLessWoker: false,
        },
      },
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })

  test('应该能够禁用LightningCSS并启用PostCSS', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        lightningcssLoader: false,
        extraPostCSSPlugins: [() => ({ postcssPlugin: 'test-plugin' })],
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该支持自定义LightningCSS配置', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        lightningcssLoader: {
          minify: true,
          drafts: {
            customMedia: true,
          },
        },
        cssMinifier: 'lightningcss',
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该支持自定义主题变量', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        theme: {
          'primary-color': '#1DA57A',
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该支持自定义样式加载器', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        styleLoader: {
          injectType: 'singletonStyleTag',
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该支持自动CSS模块化', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        autoCSSModules: true,
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该支持自定义CSS模块配置', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        lightningcssLoader: {},
        cssMinifier: 'lightningcss',
        autoCSSModules: true,
        cssLoaderModules: {
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该支持自定义Sass加载器配置', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        lightningcssLoader: {},
        cssMinifier: 'lightningcss',
        sassLoader: {
          sassOptions: {
            includePaths: ['./node_modules'],
          },
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('在 webpack 模式下不应使用 LightningCSS', () => {
    const config = createConfig({
      bundlerType: 'webpack',
      userConfig: {
        lightningcssLoader: true,
      },
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })

  test('应该支持自定义PostCSS插件', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        extraPostCSSPlugins: [() => ({ postcssPlugin: 'custom-plugin' })],
      },
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })

  test('should support custom less loader options', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        theme: {
          'primary-color': '#1DA57A',
        },
        lessLoader: {
          additionalData: '@import "test.less";',
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('should support custom less loader options with function', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        lightningcssLoader: {},
        cssMinifier: 'lightningcss',
        lessLoader: {
          additionalData: () => '@import "test.less";',
          math: 'always',
        },
      },
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })

  test('should support custom less loader options with function', () => {
    const config = createConfig({
      bundlerType: 'rspack',
      userConfig: {
        lightningcssLoader: {},
        cssMinifier: 'lightningcss',
        lessLoader: () => {
          return {
            modifyVars: {
              'primary-color': '#1DA57A',
            },
            additionalData: '@import "test.less";',
          }
        },
      },
    })
    expect(
      stringifyConfig(config, {
        verbose: true,
      }),
    ).toMatchSnapshot()
  })
})
