import type { MultiStats, Stats } from '@rspack/core'

export function lastStats(stats: Stats | MultiStats): Stats[] {
  return 'stats' in stats ? stats.stats : [stats]
}

export function getFirstStats(stats: Stats | MultiStats): Stats {
  const statsArray = lastStats(stats)
  return statsArray[0]
}
