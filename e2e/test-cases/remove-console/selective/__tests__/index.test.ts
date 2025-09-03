import path from 'node:path'
import { createUmi, unwrapOutputJSON } from '@e2e/helper'
import { expect, test } from 'vitest'

test('removeConsole: ["log", "warn"] should only remove specified methods', async () => {
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

  for (const [fileName, content] of jsFiles) {
    // 这些应该被移除
    expect(
      content,
      `File ${fileName} should not contain console.log`,
    ).not.toContain('console.log')
    expect(
      content,
      `File ${fileName} should not contain console.warn`,
    ).not.toContain('console.warn')

    // 这些应该保留
    expect(content, `File ${fileName} should contain console.error`).toContain(
      'console.error',
    )
    expect(content, `File ${fileName} should contain console.info`).toContain(
      'console.info',
    )
  }
})

test('should verify test page contains all console statements before build', () => {
  const testPagePath = path.join(__dirname, '../pages/index.tsx')
  const fs = require('fs')
  const content = fs.readFileSync(testPagePath, 'utf-8')

  // 确保测试页面确实包含所有类型的console语句
  expect(content).toContain('console.log')
  expect(content).toContain('console.warn')
  expect(content).toContain('console.error')
  expect(content).toContain('console.info')
})
