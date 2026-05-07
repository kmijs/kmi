import { describe, expect, test } from 'vitest'

describe('transformImport v2 migration', () => {
  test('modifySwcLoaderOptions uses memo.transformImport not rspackExperiments.import', () => {
    const memo: Record<string, any> = {}

    const transformImport = [
      { libraryName: 'antd', libraryDirectory: 'lib' },
      { libraryName: 'lodash', camelToDashComponentName: true },
    ]

    memo.transformImport ??= []
    memo.transformImport.push(...transformImport)

    expect(memo.transformImport).toHaveLength(2)
    expect(memo.transformImport[0].libraryName).toBe('antd')
    expect(memo.transformImport[1].libraryName).toBe('lodash')
    expect(memo.rspackExperiments).toBeUndefined()
  })

  test('memo.transformImport initializes empty array when not set', () => {
    const memo: Record<string, any> = {}

    memo.transformImport ??= []

    expect(Array.isArray(memo.transformImport)).toBe(true)
    expect(memo.transformImport).toHaveLength(0)
  })
})
