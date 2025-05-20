import { logger, picocolors } from '@kmijs/shared'
import { type IDevOpts, RspackBundler } from './bundler'

export async function dev(opts: IDevOpts) {
  if (process.env.BUNDLER_RSPACK) {
    logger.info(
      `Using bundler-rspack from ${picocolors.cyan(
        process.env.BUNDLER_RSPACK,
      )}`,
    )
  }
  const bundler = new RspackBundler()
  await bundler.dev(opts)
}
