import chalk from 'chalk'
import { PATHS } from './utils/constants'
import { spawnSync } from './utils/utils'

!(async () => {
  const args = process.argv.slice(2)

  // no cache
  if (args.includes('--no-cache')) {
    args.push('--force')
  }

  // filter
  if (!args.join(' ').includes('--filter')) {
    // Tips: should use double quotes, single quotes are not valid on windows.
    args.push(
      `--filter='./packages/*' --filter='./presets/*' --filter='./plugins/*' --filter='./solutions/*' --filter='./codemods/*' --filter='./devtools/*'`,
    )
  }

  // turbo cache
  if (!args.includes('--cache-dir')) {
    args.unshift('--cache-dir', `".turbo"`)
  }

  const command = `pnpm turbo run ${args.join(' ')}`

  console.log('command:', chalk.blue(command))

  spawnSync(command, { cwd: PATHS.ROOT })
})()
