import path from 'node:path'
import { createUmi, unwrapOutputJSON } from '@e2e/helper'
import { expect, test } from 'vitest'

test('case code splitting granularChunks', async () => {
  const cwd = path.join(__dirname, '..')
  const service = createUmi(cwd)

  await service.run({
    name: 'build',
  })

  const distPath = path.join(cwd, 'dist')
  const files = await unwrapOutputJSON(distPath)

  const [frameworkFile] = Object.entries(files).find(
    ([name, content]) =>
      name.includes('framework') && content.includes('React'),
  )!
  expect(frameworkFile).toBeTruthy()

  const jsFiles = Object.keys(files)
    .filter((name) => name.endsWith('.js'))
    .map((name) => path.basename(name))

  expect(jsFiles).toContain('umi.js')
  expect(jsFiles.find((file) => file.includes('framework'))).toBeTruthy()
  expect(jsFiles.find((file) => file.includes('polyfill'))).toBeTruthy()
  expect(jsFiles.find((file) => file.includes('lib-antd'))).toBeTruthy()
  expect(jsFiles.find((file) => file.includes('lib-plots'))).toBeTruthy()
})
