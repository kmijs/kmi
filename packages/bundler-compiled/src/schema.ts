// sort-object-keys
import type { zod as z } from '@kmijs/shared'
import { CSSMinifier, JSMinifier } from './types/bundler'

const devTool = [
  'cheap-source-map',
  'cheap-module-source-map',
  'eval',
  'eval-source-map',
  'eval-cheap-source-map',
  'eval-cheap-module-source-map',
  'eval-nosources-cheap-source-map',
  'eval-nosources-cheap-module-source-map',
  'eval-nosources-source-map',
  'source-map',
  'hidden-source-map',
  'hidden-nosources-cheap-source-map',
  'hidden-nosources-cheap-module-source-map',
  'hidden-nosources-source-map',
  'hidden-cheap-source-map',
  'hidden-cheap-module-source-map',
  'inline-source-map',
  'inline-cheap-source-map',
  'inline-cheap-module-source-map',
  'inline-nosources-cheap-source-map',
  'inline-nosources-cheap-module-source-map',
  'inline-nosources-source-map',
  'nosources-source-map',
  'nosources-cheap-source-map',
  'nosources-cheap-module-source-map',
]

export function getSchemas(): Record<
  string,
  (arg: { zod: typeof z }) => z.ZodType<any>
> {
  return {
    alias: ({ zod }) => zod.record(zod.string(), zod.any()),
    assetsInclude: ({ zod }) => zod.any(),
    autoCSSModules: ({ zod }) => zod.boolean(),
    autoprefixer: ({ zod }) => zod.record(zod.string(), zod.any()),
    babelLoaderCustomize: ({ zod }) => zod.string(),
    cacheDirectoryPath: ({ zod }) => zod.string(),
    chainWebpack: ({ zod }) => zod.function(),
    copy: ({ zod }) =>
      zod.array(
        zod.union([
          zod.object({
            from: zod.string(),
            to: zod.string(),
          }),
          zod.string(),
        ]),
      ),
    cssExtractLoader: ({ zod }) => zod.record(zod.string(), zod.any()),
    cssLoader: ({ zod }) => zod.record(zod.string(), zod.any()),
    cssLoaderModules: ({ zod }) => zod.record(zod.string(), zod.any()),
    cssMinifier: ({ zod }) =>
      zod.enum([
        CSSMinifier.lightningcss,
        CSSMinifier.esbuild,
        CSSMinifier.cssnano,
        CSSMinifier.none,
      ]),
    cssMinifierOptions: ({ zod }) => zod.record(zod.string(), zod.any()),
    cssPublicPath: ({ zod }) => zod.string(),
    deadCode: ({ zod }) =>
      zod
        .object({
          context: zod.string(),
          detectUnusedExport: zod.boolean(),
          detectUnusedFiles: zod.boolean(),
          exclude: zod.array(zod.string()),
          failOnHint: zod.boolean(),
          patterns: zod.array(zod.string()),
        })
        .deepPartial(),
    define: ({ zod }) => zod.record(zod.string(), zod.any()),
    devtool: ({ zod }) => zod.union([zod.enum(devTool as any), zod.boolean()]),
    emitAssets: ({ zod }) => zod.boolean(),
    esm: ({ zod }) => zod.object({}),
    extensions: ({ zod }) => zod.array(zod.string()),
    externals: ({ zod }) =>
      zod.union([
        zod.record(zod.string(), zod.any()),
        zod.string(),
        zod.function(),
      ]),
    extraBabelIncludes: ({ zod }) =>
      zod.array(zod.union([zod.string(), zod.instanceof(RegExp)])),
    extraBabelPlugins: ({ zod }) =>
      zod.array(zod.union([zod.string(), zod.array(zod.any())])),
    extraBabelPresets: ({ zod }) =>
      zod.array(zod.union([zod.string(), zod.array(zod.any())])),
    extraPostCSSPlugins: ({ zod }) => zod.array(zod.any()),
    fastRefresh: ({ zod }) => zod.boolean(),
    filename: ({ zod }) => zod.record(zod.string(), zod.any()),
    forkTSChecker: ({ zod }) => zod.record(zod.string(), zod.any()),
    hash: ({ zod }) => zod.boolean(),
    https: ({ zod }) =>
      zod
        .object({
          cert: zod.string(),
          hosts: zod.array(zod.string()),
          http2: zod.boolean(),
          key: zod.string(),
          outputPath: zod.string(),
        })
        .describe(
          '配置 HTTPS 选项以启用 HTTPS 服务器。当启用时，HTTP 服务器将被禁用',
        )
        .deepPartial(),
    ignoreMomentLocale: ({ zod }) => zod.boolean(),
    inlineLimit: ({ zod }) => zod.number(),
    javascriptExportsPresence: ({ zod }) =>
      zod
        .boolean()
        .optional()
        .describe('关闭不存在的导出或存在冲突的重导出时报错校验, 默认开启'),
    jsMinifier: ({ zod }) =>
      zod.enum([
        JSMinifier.swc,
        JSMinifier.terser,
        JSMinifier.esbuild,
        JSMinifier.none,
      ]),
    jsMinifierOptions: ({ zod }) => zod.record(zod.string(), zod.any()),
    lessLoader: ({ zod }) =>
      zod.union([zod.record(zod.string(), zod.any()), zod.function()]),
    manifest: ({ zod }) =>
      zod
        .object({
          basePath: zod.string(),
          fileName: zod.string(),
        })
        .deepPartial(),
    mdx: ({ zod }) =>
      zod
        .object({
          loader: zod.string(),
          loaderOptions: zod.record(zod.string(), zod.any()),
        })
        .deepPartial(),
    normalCSSLoaderModules: ({ zod }) => zod.record(zod.string(), zod.any()),
    outputPath: ({ zod }) =>
      zod.union([zod.string(), zod.record(zod.string(), zod.string())]),
    postcssLoader: ({ zod }) => zod.record(zod.string(), zod.any()),
    proxy: ({ zod }) =>
      zod.union([zod.record(zod.string(), zod.any()), zod.array(zod.any())]),
    publicPath: ({ zod }) => zod.string(),
    purgeCSS: ({ zod }) => zod.record(zod.string(), zod.any()),
    runtimePublicPath: ({ zod }) => zod.object({}),
    sassLoader: ({ zod }) => zod.record(zod.string(), zod.any()),
    styleLoader: ({ zod }) => zod.record(zod.string(), zod.any()),
    stylusLoader: ({ zod }) => zod.record(zod.string(), zod.any()),
    targets: ({ zod }) => zod.record(zod.string(), zod.any()),
    theme: ({ zod }) => zod.record(zod.string(), zod.any()),
    writeToDisk: ({ zod }) => zod.boolean(),
  }
}
