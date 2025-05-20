import { transform } from '@kmijs/bundler-compiled/compiled/babel/core'
import { expect, test } from 'vitest'

interface IOpts {
  code: string
  filename?: string
  opts?: any
}

function doTransform(opts: IOpts): string {
  return transform(opts.code, {
    filename: opts.filename || 'foo.js',
    plugins: [
      [
        require.resolve('../../dist/plugins/dynamicImportNode.js'),
        opts.opts || {},
      ],
    ],
  })!.code as string
}

test(`import('a');`, () => {
  const code = doTransform({
    code: `import('a');`,
  })
  expect(code).toContain(
    `Promise.resolve().then(() => _interopRequireWildcard(require('a')));`,
  )
})

test(`import(/*comment*/'a');`, () => {
  const code = doTransform({
    code: `import(/*comment*/'a');`,
  })
  expect(code).toContain(
    `Promise.resolve().then(() => _interopRequireWildcard(require('a')));`,
  )
})
