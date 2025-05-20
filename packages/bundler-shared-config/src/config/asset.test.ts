import Config from '@kmijs/bundler-shared/rspack-chain'
import { describe, expect, test } from 'vitest'
import { Env, type SharedConfigOptions } from '../types'
import { applyAsset } from './asset'

const createConfig = (opts: Partial<SharedConfigOptions>) => {
  const config = new Config()
  applyAsset({
    cwd: __dirname,
    env: Env.development,
    config,
    ...opts,
  } as unknown as SharedConfigOptions)
  return config.toConfig()
}
describe('asset', () => {
  test('应该能够添加额外的资源文件', () => {
    const config = createConfig({
      userConfig: {
        assetsInclude: [/\.json5$/],
      },
      staticPathPrefix: 'static',
    })
    expect(config).toMatchSnapshot()
  })

  test('应该允许使用 outputPath.image 修改输出路径', async () => {
    const config = createConfig({
      userConfig: {
        outputPath: {
          image: 'foo',
        },
      },
      staticPathPrefix: 'static',
    })
    expect(config).toMatchSnapshot()
  })

  test('应该正确添加图片规则', async () => {
    const config = createConfig({
      userConfig: {
        outputPath: {
          image: '',
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该允许使用 filename.image 修改文件名', async () => {
    const config = createConfig({
      userConfig: {
        filename: {
          image: 'demo/img/foo[ext]',
        },
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('应该能正确的配置 inlineLimit', async () => {
    const config = createConfig({
      userConfig: {
        inlineLimit: Number.MAX_SAFE_INTEGER,
      },
    })
    expect(config).toMatchSnapshot()
  })

  test('inlineLimit 允许单独设置', async () => {
    const config = createConfig({
      userConfig: {
        inlineLimit: {
          image: 5 * 1024,
          media: 1024,
          svg: 233,
        },
      },
    })
    expect(config).toMatchSnapshot()
  })
})
