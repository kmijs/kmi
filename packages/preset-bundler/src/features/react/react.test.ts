import { describe, expect, test } from 'vitest'

describe('ReactRefreshRspackPlugin v2 named import', () => {
  test('ReactRefreshRspackPlugin is a named export (not default)', async () => {
    const mod = await import('@rspack/plugin-react-refresh')
    expect(mod.ReactRefreshRspackPlugin).toBeDefined()
    expect(typeof mod.ReactRefreshRspackPlugin).toBe('function')
  })
})
