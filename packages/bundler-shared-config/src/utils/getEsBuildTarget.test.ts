import { expect, test } from 'vitest'
import { getEsBuildTarget } from './getEsBuildTarget'

test('normal', () => {
  expect(
    getEsBuildTarget({
      targets: { chrome: 80, firefox: 100 },
      jsMinifier: 'esbuild',
    }),
  ).toEqual(['chrome80', 'firefox100'])
})

test('ie is not supported esbuild minify', () => {
  expect(() =>
    getEsBuildTarget({
      targets: { ie: 11 },
      jsMinifier: 'esbuild',
    }),
  ).toThrow('不支持 IE 浏览器')
})
