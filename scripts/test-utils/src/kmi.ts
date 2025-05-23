import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setNodeEnv } from '@kmijs/shared'
import { type Configuration, Env, type IConfig } from '@kmijs/types'
import { Service as CoreService } from '@umijs/core'

const __dirname = dirname(fileURLToPath(import.meta.url))

export class TestService extends CoreService {
  constructor(opts: {
    cwd: string
    env: Env
    presets?: string[]
    plugins: string[]
  }) {
    const { cwd } = opts
    process.env.UMI_DIR = dirname(require.resolve('umi/package.json'))
    super({
      ...opts,
      cwd,
      presets: [
        require.resolve('@umijs/preset-umi'),
        require.resolve('@kmijs/preset-bundler'),
        ...(opts.presets || []),
      ],
      defaultConfigFiles: ['config/config.ts', 'kmi.config.ts', '.umirc.ts'],
      plugins: [
        existsSync(join(cwd, 'plugin.ts')) && join(cwd, 'plugin.ts'),
        join(__dirname, './testPlugin.ts'),
        ...(opts?.plugins || []),
      ].filter(Boolean) as string[],
    })
  }

  async getWebpackConfig(): Promise<any> {
    return this.run({ name: '@@test:webpackConfig' })
  }

  async getConfig<T = IConfig>(): Promise<T> {
    return this.run({ name: '@@test:config' }) as Promise<T>
  }

  async getUserConfig<T = IConfig>(): Promise<T> {
    return this.run({ name: '@@test:userConfig' }) as Promise<T>
  }

  async getAppData(): Promise<any> {
    return this.run({ name: '@@test:appData' })
  }

  async getBundlerConfig(env: Env) {
    setNodeEnv(env)
    return this.run({
      name: '@@test:webpackConfig',
    }) as unknown as Promise<Configuration>
  }
}

interface KmiOptions {
  cwd: string
  env?: Env
  plugins: string[]
  presets?: string[]
}

export function createKmi({
  cwd,
  env = Env.production,
  plugins,
  presets,
}: KmiOptions): TestService {
  return new TestService({
    cwd,
    env,
    plugins,
    presets,
  })
}
