import type { SpawnSyncOptions, SpawnSyncReturns } from 'node:child_process'
import spawn from 'cross-spawn'

export function spawnSync(
  cmd: string,
  opts: SpawnSyncOptions,
): SpawnSyncReturns<string | Buffer> {
  const result = spawn.sync(cmd, {
    shell: true,
    stdio: 'inherit',
    ...opts,
  })
  if (result.status !== 0) {
    // logger.error(`Execute command error (${cmd})`)
    process.exit(1)
  }
  return result
}
