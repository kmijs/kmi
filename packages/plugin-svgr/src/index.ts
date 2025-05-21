import { DEFAULT_INLINE_LIMIT } from '@kmijs/bundler-shared'
import type { IApi } from '@kmijs/types'

const SVG_REGEX = /\.svg$/

export default (api: IApi) => {
  api.describe({
    key: '@kmijs/plugin-svgr',
  })

  api.bundlerChain((memo, { CHAIN_ID }) => {
    // Reuse umi's svgr registration
    if (!api.config.svgr) {
      return memo
    }
    const { svgo, svgr } = api.config
    const {
      mixedImport = false,
      excludeImporter,
      exclude,
      ...svgrOptions
    } = svgr

    let generatorOptions: Record<string, any> = {}
    if (memo.module.rules.has(CHAIN_ID.RULE.SVG)) {
      generatorOptions = memo.module.rules
        .get(CHAIN_ID.RULE.SVG)
        .oneOfs.get(CHAIN_ID.ONE_OF.SVG_URL)
        .get('generator')
      memo.module.rules.delete(CHAIN_ID.RULE.SVG)
    }

    const inlineLimit = api.config.inlineLimit ?? DEFAULT_INLINE_LIMIT
    const maxSize =
      typeof inlineLimit === 'number' ? inlineLimit : inlineLimit.svg

    const rule = memo.module.rule(CHAIN_ID.RULE.SVG).test(SVG_REGEX)

    const mergedSvgrOptions = {
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeTitle: false,
              },
            },
          },
          'prefixIds',
        ],
        ...svgo,
      },
      ...svgr,
      svgo: !!svgo,
    }

    // force to url: "foo.svg?url",
    rule
      .oneOf(CHAIN_ID.ONE_OF.SVG_URL)
      .type('asset/resource')
      .resourceQuery(/(__inline=false|url)/)
      .set('generator', generatorOptions)

    // force to inline: "foo.svg?inline"
    rule
      .oneOf(CHAIN_ID.ONE_OF.SVG_INLINE)
      .type('asset/inline')
      .resourceQuery(/inline/)

    // force to react component: "foo.svg?react"
    rule
      .oneOf(CHAIN_ID.ONE_OF.SVG_REACT)
      .type('javascript/auto')
      .resourceQuery(svgr?.query || /react/)
      .use(CHAIN_ID.USE.SVGR)
      .loader(require.resolve('./loader'))
      .options(mergedSvgrOptions)
      .end()

    if (mixedImport || svgrOptions.exportType) {
      const { exportType = mixedImport ? 'named' : undefined } = svgrOptions
      const issuerInclude = [/\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/, /\.mdx$/]
      const issuer = excludeImporter
        ? { and: [issuerInclude, { not: excludeImporter }] }
        : issuerInclude

      const svgRule = rule.oneOf(CHAIN_ID.ONE_OF.SVG)

      if (exclude) {
        svgRule.exclude.add(exclude)
      }

      svgRule
        .type('javascript/auto')
        // The issuer option ensures that SVGR will only apply if the SVG is imported from a JS file.
        .set('issuer', issuer)
        .use(CHAIN_ID.USE.SVGR)
        .loader(require.resolve('./loader'))
        .options({
          ...mergedSvgrOptions,
          exportType,
        })
        .end()

      /**
       * For mixed import.
       * @example import logoUrl, { ReactComponent } from './logo.svg';`
       */
      if (mixedImport && exportType === 'named') {
        svgRule
          .use(CHAIN_ID.USE.URL)
          .loader(require.resolve('../compiled/url-loader'))
          .options({
            limit: maxSize,
            name: generatorOptions?.filename,
            fallback: require.resolve('../compiled/file-loader'),
          })
      }
    }

    // SVG as assets
    rule
      .oneOf(CHAIN_ID.ONE_OF.SVG_ASSET)
      .type('asset')
      .parser({
        // Inline SVG if size < maxSize
        dataUrlCondition: {
          maxSize,
        },
      })
      .set('generator', generatorOptions)

    return memo
  })

  api.registerPlugins([require.resolve('./svgo')])
}
