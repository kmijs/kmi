import { type IDevOpts, WebpackBundler } from './bundler'

export async function dev(opts: IDevOpts) {
  const bundler = new WebpackBundler()
  return bundler.dev(opts)
}
