import { describe, expect, test, vi } from 'vitest'
import { applyIncremental } from './incremental'

describe('incremental v2 migration', () => {
  test('uses config.set not config.experiments', () => {
    const bundlerChainCallbacks: Array<(config: any) => any> = []
    const mockConfig = {
      set: vi.fn().mockReturnThis(),
      experiments: vi.fn().mockReturnThis(),
    }

    const mockApi = {
      config: { rspack: { incremental: true } },
      env: 'development',
      logger: { info: vi.fn() },
      bundlerChain: vi.fn((cb: (config: any) => any) =>
        bundlerChainCallbacks.push(cb),
      ),
    }

    applyIncremental(mockApi as any)

    bundlerChainCallbacks.forEach((cb) => cb(mockConfig))

    expect(mockConfig.set).toHaveBeenCalledWith('incremental', true)
    expect(mockConfig.experiments).not.toHaveBeenCalled()
  })

  test('does not set incremental when config is disabled', () => {
    const bundlerChainCallbacks: Array<(config: any) => any> = []
    const mockConfig = {
      set: vi.fn().mockReturnThis(),
      experiments: vi.fn().mockReturnThis(),
    }

    const mockApi = {
      config: { rspack: { incremental: false } },
      env: 'development',
      logger: { info: vi.fn() },
      bundlerChain: vi.fn((cb: (config: any) => any) =>
        bundlerChainCallbacks.push(cb),
      ),
    }

    applyIncremental(mockApi as any)

    bundlerChainCallbacks.forEach((cb) => cb(mockConfig))

    expect(mockConfig.set).not.toHaveBeenCalled()
    expect(mockConfig.experiments).not.toHaveBeenCalled()
  })
})
