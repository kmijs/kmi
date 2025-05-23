import path from 'node:path'
import { createUmi, unwrapOutputJSON } from '@e2e/helper'
import { expect, test } from 'vitest'

test('case code splitting big vendors', async () => {
  const cwd = path.join(__dirname, '..')
  const service = createUmi(cwd)
  await service.run({
    name: 'build',
  })
  const distPath = path.join(cwd, 'dist')
  const files = await unwrapOutputJSON(distPath)

  const [vendorFile] = Object.entries(files).find(
    ([name, content]) =>
      name.includes('chunk-vendors') && content.includes('React'),
  )!
  expect(vendorFile).toBeTruthy()

  const jsFiles = Object.keys(files)
    .filter((name) => name.endsWith('.js'))
    .map((name) => path.basename(name))

  expect(jsFiles.length).toEqual(2)
  expect(jsFiles).toContain('umi.js')
  expect(jsFiles).toContain('chunk-vendors.js')
})
