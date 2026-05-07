import { describe, expect, test, vi } from 'vitest'
import { applyLazyCompilation } from './lazyCompilation'

describe('lazyCompilation v2 migration', () => {
  test('uses config.set not config.experiments', () => {
    const bundlerChainCallbacks: Array<(config: any) => any> = []
    const mockConfig = {
      set: vi.fn().mockReturnThis(),
      experiments: vi.fn().mockReturnThis(),
    }

    const mockApi = {
      config: { rspack: { lazyCompilation: true } },
      env: 'development',
      logger: { info: vi.fn() },
      bundlerChain: vi.fn((cb: (config: any) => any) =>
        bundlerChainCallbacks.push(cb),
      ),
    }

    applyLazyCompilation(mockApi as any)

    bundlerChainCallbacks.forEach((cb) => cb(mockConfig))

    expect(mockConfig.set).toHaveBeenCalledWith(
      'lazyCompilation',
      expect.objectContaining({
        test: expect.any(Function),
      }),
    )
    expect(mockConfig.experiments).not.toHaveBeenCalled()
  })

  test('does not set lazyCompilation when config is disabled', () => {
    const bundlerChainCallbacks: Array<(config: any) => any> = []
    const mockConfig = {
      set: vi.fn().mockReturnThis(),
      experiments: vi.fn().mockReturnThis(),
    }

    const mockApi = {
      config: { rspack: { lazyCompilation: false } },
      env: 'development',
      logger: { info: vi.fn() },
      bundlerChain: vi.fn((cb: (config: any) => any) =>
        bundlerChainCallbacks.push(cb),
      ),
    }

    applyLazyCompilation(mockApi as any)

    bundlerChainCallbacks.forEach((cb) => cb(mockConfig))

    expect(mockConfig.set).not.toHaveBeenCalled()
    expect(mockConfig.experiments).not.toHaveBeenCalled()
  })
})
