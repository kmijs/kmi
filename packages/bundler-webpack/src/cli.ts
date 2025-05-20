import assert from 'node:assert'
import { existsSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { esbuild } from '@kmijs/bundler-shared/esbuild'
import { picocolors, register, tryPaths, yParser } from '@kmijs/shared'
import { build } from './build'
import { dev } from './dev'

const args = yParser(process.argv.slice(2), {})
const command = args._[0]
const cwd = process.cwd()

const entry = tryPaths([
  join(cwd, 'src/index.tsx'),
  join(cwd, 'src/index.ts'),
  join(cwd, 'index.tsx'),
  join(cwd, 'index.ts'),
])

let config = {}
const configFile = resolve(cwd, args.config || 'config.ts')
register.register({
  implementor: esbuild,
})
register.clearFiles()
if (existsSync(configFile)) {
  require('./requireHook')
  config = require(configFile).default
}
Object.assign(config, args)

if (command === 'build') {
  ;(async () => {
    process.env.NODE_ENV = 'production'
    assert(entry, 'Build failed: entry not found.')
    try {
      await build({
        config,
        cwd,
        entry: {
          [getEntryKey(entry)]: entry,
        },
      })
    } catch (e) {
      console.error(e)
    }
  })()
} else if (command === 'dev') {
  ;(async () => {
    process.env.NODE_ENV = 'development'
    try {
      assert(entry, 'Build failed: entry not found.')
      await dev({
        config,
        cwd,
        port: process.env.PORT as number | undefined,
        entry: {
          [getEntryKey(entry)]: entry,
        },
        cache: {
          buildDependencies: [].filter(Boolean),
        },
      })
    } catch (e) {
      console.error(e)
    }
  })()
} else {
  error(`Unsupported command ${command}.`)
}

function error(msg: string) {
  console.error(picocolors.red(msg))
}

function getEntryKey(path: string) {
  return basename(path, extname(path))
}
