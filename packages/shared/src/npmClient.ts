import { existsSync } from 'node:fs'
import { join } from 'node:path'

export type NpmClient = 'npm' | 'yarn' | 'pnpm'
export const npmClients = ['pnpm', 'yarn', 'npm']
export enum NpmClientEnum {
  pnpm = 'pnpm',
  yarn = 'yarn',
  npm = 'npm',
}
export const getNpmClient = (opts: { cwd: string }): NpmClient => {
  const chokidarPath = require.resolve('../compiled/chokidar')
  if (
    chokidarPath.includes('.pnpm') ||
    existsSync(join(opts.cwd, 'node_modules', '.pnpm'))
  ) {
    return 'pnpm'
  }
  if (
    existsSync(join(opts.cwd, 'yarn.lock')) ||
    existsSync(join(opts.cwd, 'node_modules', '.yarn-integrity'))
  ) {
    return 'yarn'
  }
  return 'npm'
}

export const installWithNpmClient = ({
  npmClient,
  cwd,
}: {
  npmClient: NpmClient
  cwd?: string
}): void => {
  const { sync } = require('../compiled/cross-spawn')
  // pnpm install will not install devDependencies when NODE_ENV === 'production'
  // we should remove NODE_ENV to make sure devDependencies can be installed
  const { NODE_ENV: _, ...env } = process.env
  const npm = sync(npmClient, [npmClient === 'yarn' ? '' : 'install'], {
    stdio: 'inherit',
    cwd,
    env,
  })
  if (npm.error) {
    throw npm.error
  }
}
