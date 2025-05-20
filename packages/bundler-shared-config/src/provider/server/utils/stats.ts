import type { MultiStats, Stats } from '@kmijs/bundler-shared/rspack'

export function getStats(stats: Stats | MultiStats) {
  return stats.toJson({
    all: false,
    hash: true,
    assets: true,
    warnings: true,
    errors: true,
    errorDetails: false,
    moduleTrace: true,
    preset: 'errors-warnings',
  })
}
