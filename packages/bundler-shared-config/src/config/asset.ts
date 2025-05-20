import { CHAIN_ID } from '@kmijs/bundler-shared'
import type { GeneratorOptionsByModuleType } from '@kmijs/bundler-shared/rspack'
import type Config from '@kmijs/bundler-shared/rspack-chain'
import { pathe } from '@kmijs/shared'
import {
  AUDIO_EXTENSIONS,
  FONT_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from '../constants'
import type { SharedConfigOptions } from '../types'
import { getFilename } from '../utils/getFilename'
import { getInlineLimit } from '../utils/getInlineLimit'
import { getOutputPath } from '../utils/getOutputPath'

const chainStaticAssetRule = ({
  emit,
  rule,
  maxSize,
  filename,
  assetType,
}: {
  emit: boolean
  rule: Config.Rule
  maxSize: number
  filename: string
  assetType: string
}) => {
  const generatorOptions:
    | GeneratorOptionsByModuleType['asset']
    | GeneratorOptionsByModuleType['asset/resource'] = {
    filename,
  }

  if (emit === false) {
    generatorOptions.emit = false
  }

  // force to url: "foo.png?url" or "foo.png?__inline=false"
  rule
    .oneOf(`${assetType}-asset-url`)
    .type('asset/resource')
    .resourceQuery(/(__inline=false|url)/)
    .set('generator', generatorOptions)

  // force to inline: "foo.png?inline"
  rule
    .oneOf(`${assetType}-asset-inline`)
    .type('asset/inline')
    .resourceQuery(/inline/)

  // default: when size < dataUrlCondition.maxSize will inline
  rule
    .oneOf(`${assetType}-asset`)
    .type('asset')
    .parser({
      dataUrlCondition: {
        maxSize,
      },
    })
    .set('generator', generatorOptions)
}

export function getRegExpForExts(exts: string[]): RegExp {
  const matcher = exts
    .map((ext) => ext.trim())
    .map((ext) => (ext.startsWith('.') ? ext.slice(1) : ext))
    .join('|')

  return new RegExp(
    exts.length === 1 ? `\\.${matcher}$` : `\\.(?:${matcher})$`,
    'i',
  )
}

export function applyAsset(opts: SharedConfigOptions) {
  const { config, userConfig } = opts

  const { emitAssets = true, assetsInclude } = userConfig

  const getMergedFilename = (
    assetType: 'svg' | 'font' | 'image' | 'media' | 'assets',
  ) => {
    const distDir = getOutputPath(opts, assetType)
    const filename = getFilename(opts, assetType)
    return pathe.join(distDir, filename)
  }

  const createAssetRule = (
    assetType: 'svg' | 'font' | 'image' | 'media',
    exts: string[],
    emit: boolean,
  ) => {
    const regExp = getRegExpForExts(exts)
    const maxSize = getInlineLimit(userConfig, assetType)
    const rule = config.module.rule(assetType).test(regExp)

    chainStaticAssetRule({
      emit,
      rule,
      maxSize,
      filename: getMergedFilename(assetType),
      assetType,
    })
  }

  // image
  createAssetRule(CHAIN_ID.RULE.IMAGE, IMAGE_EXTENSIONS, emitAssets)
  // svg
  createAssetRule(CHAIN_ID.RULE.SVG, ['svg'], emitAssets)
  // media
  createAssetRule(
    CHAIN_ID.RULE.MEDIA,
    [...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS],
    emitAssets,
  )
  // font
  createAssetRule(CHAIN_ID.RULE.FONT, FONT_EXTENSIONS, emitAssets)
  // assets
  const assetsFilename = getMergedFilename('assets')
  config.output.assetModuleFilename(assetsFilename)
  if (!emitAssets) {
    config.module.generator.merge({ 'asset/resource': { emit: false } })
  }

  if (assetsInclude) {
    const rule = config.module
      .rule(CHAIN_ID.RULE.ADDITIONAL_ASSETS)
      .test(assetsInclude)

    const maxSize = getInlineLimit(userConfig, 'assets')

    chainStaticAssetRule({
      emit: emitAssets,
      rule,
      maxSize,
      filename: assetsFilename,
      assetType: 'additional-assets',
    })
  }
}
