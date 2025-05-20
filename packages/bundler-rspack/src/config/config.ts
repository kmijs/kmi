import {
  BaseBundlerConfig,
  type BundlerPlugins,
  type IBaseBundlerApplyOpts,
  type IBaseBundlerConfigOpts,
} from '@kmijs/bundler-shared-config'
import {
  type Configuration,
  CssExtractRspackPlugin,
  rspack,
} from '@kmijs/bundler-shared/rspack'
import { importLazy } from '@kmijs/shared'
// @ts-expect-error
import { RspackManifestPlugin } from '../../compiled/rspack-manifest-plugin'
import { RuntimePublicPathPlugin } from '../plugins/RuntimePublicPathPlugin'
import type { IConfig, IExtraRspackOpts } from '../types'
import { addProgressPlugin } from './progressPlugin'
import { addSwcRules } from './swcRules'

const {
  TsCheckerRspackPlugin,
}: typeof import('../../compiled/ts-checker-rspack-plugin') = importLazy(
  require.resolve('../../compiled/ts-checker-rspack-plugin'),
)

export type IOpts = IBaseBundlerConfigOpts<IConfig> & IExtraRspackOpts

export interface IApplyOpts
  extends IBaseBundlerApplyOpts<IConfig>,
    IExtraRspackOpts {}

class RspackConfig extends BaseBundlerConfig<IConfig, IApplyOpts, IOpts> {
  constructor(opts: IOpts) {
    super(opts, 'rspack', rspack)

    // rspack 特有的配置检查
    // TODO: 需要补充 rspack 的配置检查
    // checkConfig(opts)
  }

  protected prepareApplyOpts(): IApplyOpts {
    return {
      ...super.prepareApplyOpts(),
      extraSwcPlugins: this.opts.extraSwcPlugins || [],
      modifySwcLoaderOptions: this.opts.modifySwcLoaderOptions,
    }
  }

  protected getPlugins(): BundlerPlugins {
    return {
      BannerPlugin: rspack.BannerPlugin,
      DefinePlugin: rspack.DefinePlugin,
      IgnorePlugin: rspack.IgnorePlugin,
      ProvidePlugin: rspack.ProvidePlugin,
      HotModuleReplacementPlugin: rspack.HotModuleReplacementPlugin,
      CopyPlugin: rspack.CopyRspackPlugin,
      ManifestPlugin: RspackManifestPlugin,
      TsCheckerPlugin: TsCheckerRspackPlugin,
      CssExtractPlugin: CssExtractRspackPlugin,
      RuntimePublicPathPlugin,
    }
  }

  protected async addRules(): Promise<void> {
    await addSwcRules(this.applyOpts)
  }

  protected async addPlugins(): Promise<void> {
    await addProgressPlugin(this.applyOpts)
  }
}

export async function getConfig(opts: IOpts): Promise<Configuration> {
  const config = new RspackConfig(opts)
  return config.getConfig()
}
