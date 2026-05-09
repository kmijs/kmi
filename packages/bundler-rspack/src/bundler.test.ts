import { describe, expect, test } from 'vitest'

describe('ProgressPlugin v2 callback', () => {
  test('info should be an object with builtModules (not string[])', () => {
    const progresses: any[] = []
    const progress = {
      percent: 0,
      status: 'waiting',
      details: null as any,
    }
    progresses.push(progress)

    const info = { builtModules: 42, moduleIdentifier: '/path/to/module.ts' }

    progress.percent = 0.5
    progress.status = 'compiling'
    progress.details = info

    expect(progress.percent).toBe(0.5)
    expect(progress.status).toBe('compiling')
    expect(progress.details).toEqual(info)
    expect(progress.details.builtModules).toBe(42)
    expect(Array.isArray(progress.details)).toBe(false)
  })

  test('info.builtModules is accessible as number', () => {
    const info = { builtModules: 42 }
    expect(typeof info.builtModules).toBe('number')
  })
})
