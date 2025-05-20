import Config from '@kmijs/bundler-shared/rspack-chain'
import { stringifyConfig } from '@kmijs/shared'
import { describe, expect, test } from 'vitest'
import { Env, type SharedConfigOptions } from '../types'
import { applyOutput } from './output'

class CssExtractPlugin {
  apply(compiler: any) {}
}

const createConfig = (opts: Partial<SharedConfigOptions>) => {
  const config = new Config()
  applyOutput({
    cwd: __dirname,
    env: Env.production,
    config,
    bundler: {
      CssExtractPlugin,
    },
    ...opts,
  } as SharedConfigOptions)
  return config.toConfig()
}
describe('output', () => {
  test('normal', () => {
    const config = createConfig({
      userConfig: {},
      staticPathPrefix: 'static/',
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('normal dev', () => {
    const config = createConfig({
      userConfig: {},
      staticPathPrefix: 'static/',
      env: Env.development,
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('应该允许使用 outputPath 自定义目录', () => {
    const config = createConfig({
      userConfig: {
        outputPath: 'dist/server',
      },
      staticPathPrefix: 'static/',
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('应该允许使用 outputPath.root 自定义目录', () => {
    const config = createConfig({
      userConfig: {
        outputPath: {
          root: 'dist/server',
        },
      },
      staticPathPrefix: 'static/',
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('should allow to set outputPath.js and outputPath.css to empty string', () => {
    const config = createConfig({
      userConfig: {
        outputPath: {
          js: '',
          css: '',
        },
      },
      staticPathPrefix: 'static/',
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('应该允许通过 outputPath.js 自定义 js 路径', () => {
    const config = createConfig({
      userConfig: {
        outputPath: {
          js: 'static/js',
        },
      },
      staticPathPrefix: 'static/',
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('允许 自定义 filename', () => {
    const config = createConfig({
      userConfig: {
        filename: {
          js: '[name].[contenthash:10].js',
          jsAsync: 'async/[name].[contenthash:8].js',
          css: '[name].[contenthash:10].css',
          cssAsync: 'async/[name].[contenthash:8].css',
        },
      },
      staticPathPrefix: 'static/',
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })
})
