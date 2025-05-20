#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import { sync } from 'cross-spawn'

const argv = process.argv.slice(2)
const name = argv[0]
const __dirname = dirname(fileURLToPath(import.meta.url))
const scriptsPath = join(__dirname, `../src/${name}.ts`)

assert(
  existsSync(scriptsPath) && !name.startsWith('.'),
  `Executed script '${chalk.red(name)}' does not exist`,
)

console.log(chalk.cyan(`kmi-scripts: ${name}\n`))

const spawn = sync('tsx', [scriptsPath, ...argv.slice(1)], {
  env: {
    ...process.env,
    // disable `(node:92349) ExperimentalWarning: `--experimental-loader` may be removed in the future;` warning
    // more context: https://github.com/umijs/umi/pull/11981
    NODE_NO_WARNINGS: '1'
  },
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
})
if (spawn.status !== 0) {
  console.log(chalk.red(`kmi-scripts: ${name} execute fail`))
  process.exit(1)
}
