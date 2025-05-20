import { type IBuildOpts, WebpackBundler } from './bundler'

export async function build(opts: IBuildOpts) {
  const bundler = new WebpackBundler()
  return bundler.build(opts)
}
