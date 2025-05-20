import { type IBuildOpts, RspackBundler } from './bundler'

export async function build(opts: IBuildOpts) {
  const bundler = new RspackBundler()
  return bundler.build(opts)
}
