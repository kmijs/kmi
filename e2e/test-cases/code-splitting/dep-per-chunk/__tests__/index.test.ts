import path from 'node:path'
import { createUmi, unwrapOutputJSON } from '@e2e/helper'
import { expect, test } from 'vitest'

test('case code splitting depPerChunk', async () => {
  const cwd = path.join(__dirname, '..')
  const service = createUmi(cwd)
  await service.run({
    name: 'build',
  })
  const distPath = path.join(cwd, 'dist')
  const files = await unwrapOutputJSON(distPath)

  const [reactFile] = Object.entries(files).find(
    ([name, content]) =>
      name.includes('npm.react') && content.includes('React'),
  )!
  expect(reactFile).toBeTruthy()

  const jsFiles = Object.keys(files)
    .filter((name) => name.endsWith('.js'))
    .map((name) => path.basename(name))

  expect(jsFiles).toContain('kmi.js')
  expect(jsFiles.find((file) => file.includes('npm.react'))).toBeTruthy()
  expect(jsFiles.find((file) => file.includes('npm.antd'))).toBeTruthy()
  expect(jsFiles.find((file) => file.includes('npm.react-dom'))).toBeTruthy()
  expect(jsFiles.find((file) => file.includes('npm.scheduler'))).toBeTruthy()
})
