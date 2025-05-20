import { defineWorkspace } from 'vitest/config'

// 判断当前环境是 mac
const isCi = process.env.KCI_PIPELINE_NAME
const isE2e = process.env.E2E

// 测试文件路径配置
const testPaths = {
  e2e: ['e2e/**/*.test.ts'],
  normal: [
    'packages/**/*.test.ts',
    'presets/**/*.test.ts',
    'plugins/**/*.test.ts',
    'solutions/**/*.test.ts',
    'codemods/**/*.test.ts',
  ],
}

// CI 环境下根据 E2E 标记选择测试范围
// 非 CI 环境运行所有测试
const include = isCi
  ? isE2e
    ? testPaths.e2e
    : testPaths.normal
  : [...testPaths.e2e, ...testPaths.normal]

export default defineWorkspace([
  {
    test: {
      name: 'node',
      globals: true,
      environment: 'node',
      testTimeout: 60 * 1000,
      restoreMocks: true,
      ...(isE2e
        ? {
            maxConcurrency: 3,
            include,
          }
        : {
            include,
          }),
      exclude: [
        '**/node_modules/**',
        '**/lib/**',
        '**/dist/**',
        '**/tests/fixtures/**',
        'examples/**',
      ],
      setupFiles: ['./scripts/vitest.setup.ts'],
    },
    esbuild: {
      target: 'node18',
    },
  },
])
