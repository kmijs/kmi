import Config from '@kmijs/bundler-shared/rspack-chain'
import { stringifyConfig } from '@kmijs/shared'
import { describe, expect, test } from 'vitest'
import { Env, type SharedConfigOptions } from '../types'
import { applyBasic } from './basic'

const createConfig = (opts: Partial<SharedConfigOptions>) => {
  const config = new Config()
  applyBasic({
    cwd: __dirname,
    env: Env.production,
    config,
    entry: {},
    ...opts,
  } as SharedConfigOptions)
  return config.toConfig()
}
describe('output', () => {
  test('normal', () => {
    const config = createConfig({
      userConfig: {},
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })

  test('自定义 extensions', () => {
    const config = createConfig({
      userConfig: {
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.web.js',
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.mjs',
          '.cjs',
          '.json',
          '.wasm',
        ],
      },
    })
    expect(stringifyConfig(config)).toMatchSnapshot()
  })
})
