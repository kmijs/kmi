import { existsSync } from 'node:fs'
import { join } from 'node:path'
import execa from '../compiled/execa'
import * as logger from './logger'

interface IInstallDeps {
  devDependencies?: string[]
  dependencies?: string[]
}

export async function installDeps({
  opts,
  cwd = process.cwd(),
}: {
  opts: IInstallDeps
  cwd?: string
}): Promise<void> {
  const { dependencies, devDependencies } = opts
  const useYarn =
    existsSync(join(cwd, 'yarn.lock')) ||
    existsSync(join(process.cwd(), 'yarn.lock'))
  const usePnpm =
    existsSync(join(cwd, 'pnpm-workspace.yaml')) ||
    existsSync(join(process.cwd(), 'pnpm-workspace.yaml'))
  const runNpm = useYarn ? 'yarn' : usePnpm ? 'pnpm' : 'npm'
  const install = useYarn || usePnpm ? 'add' : 'install'
  const devTag = useYarn || usePnpm ? '--D' : '--save-dev'
  const installDependencies = (
    deps: string[],
    npmStr: string,
    insStr: string,
    devStr?: string,
  ) => {
    logger.event(`${npmStr} install dependencies packages:${deps.join(' ')}`)

    execa.commandSync(
      [npmStr, insStr, devStr]
        .concat(deps)
        .filter((n) => n)
        .join(' '),
      {
        encoding: 'utf8',
        cwd,
        env: {
          ...process.env,
        },
        stderr: 'pipe',
        stdout: 'pipe',
      },
    )
    logger.info('install dependencies packages success')
  }
  if (dependencies) {
    installDependencies(dependencies, runNpm, install)
  }
  if (devDependencies) {
    installDependencies(devDependencies, runNpm, install, devTag)
  }
}
