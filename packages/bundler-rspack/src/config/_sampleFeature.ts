import type { RspackChain } from '@kmijs/bundler-shared/rspack-chain'
import type { Env, IConfig } from '../types'

interface IOpts {
  config: RspackChain
  userConfig: IConfig
  cwd: string
  env: Env
}

export async function addSampleFeature(opts: IOpts) {
  const { config, userConfig, cwd, env } = opts
  config
  userConfig
  cwd
  env
}
