import { defineWorkspace } from 'vitest/config'

const testPaths = {
  e2e: ['e2e/**/*.test.ts'],
  normal: ['packages/**/*.test.ts'],
}

const include = [...testPaths.e2e, ...testPaths.normal]

export default defineWorkspace([
  {
    test: {
      name: 'node',
      globals: true,
      environment: 'node',
      testTimeout: 60 * 1000,
      restoreMocks: true,
      include,
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
