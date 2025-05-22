import chalk from 'chalk'
import { PATHS } from './utils/constants'
import { spawnSync } from './utils/utils'

!(async () => {
  const args = process.argv.slice(2)

  // no cache
  if (args.includes('--no-cache')) {
    args.push('--force')
  }

  // turbo cache
  if (!args.includes('--cache-dir')) {
    args.unshift('--cache-dir', `".turbo"`)
  }

  const command = `pnpm turbo run ${args.join(' ')}`

  console.log('command:', chalk.blue(command))

  spawnSync(command, { cwd: PATHS.ROOT })
})()
