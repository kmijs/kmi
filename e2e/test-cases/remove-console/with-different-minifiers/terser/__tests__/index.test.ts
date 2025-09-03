import path from 'node:path'
import { createUmi, unwrapOutputJSON } from '@e2e/helper'
import { expect, test } from 'vitest'

test('removeConsole with terser minifier should remove all console statements', async () => {
  const cwd = path.join(__dirname, '..')
  const service = createUmi(cwd)

  await service.run({ name: 'build' })

  const distPath = path.join(cwd, 'dist')
  const files = await unwrapOutputJSON(distPath)

  // 获取主要的JS文件
  const jsFiles = Object.entries(files).filter(
    ([name]) => name.endsWith('.js') && name.includes('umi'),
  )

  expect(jsFiles.length).toBeGreaterThan(0)

  // 验证所有console语句都被移除
  for (const [fileName, content] of jsFiles) {
    expect(
      content,
      `File ${fileName} should not contain console.log`,
    ).not.toContain('console.log')
    expect(
      content,
      `File ${fileName} should not contain console.warn`,
    ).not.toContain('console.warn')
    expect(
      content,
      `File ${fileName} should not contain console.error`,
    ).not.toContain('console.error')
    expect(
      content,
      `File ${fileName} should not contain console.info`,
    ).not.toContain('console.info')
  }
})
