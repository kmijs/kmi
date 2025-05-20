import { zod } from '@kmijs/shared'
import { expect, test } from 'vitest'
import { getSchemas } from './schema'
import type { IConfig } from './types'

const schemas = getSchemas()
const config = {
  alias: {
    umi: 'umi-next',
  },
  chainWebpack: () => {},
  copy: [
    {
      from: '/public',
      to: '/dist',
    },
  ],
  cssLoader: {},
  cssLoaderModules: {},
  cssMinifier: 'esbuild',
  cssMinifierOptions: {},
  define: {},
  deadCode: {},
  https: {},
  devtool: 'cheap-module-source-map',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  extraBabelPlugins: ['a', ['b', {}]],
  extraBabelPresets: ['a', ['b', {}]],
  extraPostCSSPlugins: [],
  hash: true,
  ignoreMomentLocale: true,
  jsMinifier: 'esbuild',
  jsMinifierOptions: {},
  lessLoader: {},
  outputPath: 'abc',
  postcssLoader: {},
  proxy: {},
  publicPath: 'abc',
  sassLoader: {},
  srcTranspiler: 'esbuild',
  styleLoader: {},
  targets: {},
  writeToDisk: true,
} as IConfig

test('normal', () => {
  Object.keys(config).forEach((key: any) => {
    const schema = schemas[key]({ zod })
    // @ts-ignore
    const { error } = schema.safeParse(config[key])
    expect(error).toBe(undefined)
  })
})
