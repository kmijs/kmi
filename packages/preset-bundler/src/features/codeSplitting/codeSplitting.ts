import crypto from 'node:crypto'
import { NormalModule } from '@kmijs/bundler-shared/rspack'
import { resolveNodeModulePath } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'
import type { CacheGroups, ForceSplitting } from '@kmijs/types'
import { NODE_MODULES_REGEX } from '../../constants'

export default (api: IApi) => {
  api.describe({
    key: 'preset-bundler:codeSplitting',
  })

  api.bundlerChain((memo) => {
    if (!api.config.codeSplitting) {
      return memo
    }

    if (api.env !== 'production') return memo

    const { jsStrategy, jsStrategyOptions } = api.config.codeSplitting

    // forceSplitting 指定的模块强制拆分为一个独立的 chunk
    // override 自定义拆包配置, 此配置会和默认的拆包策略合并 (cacheGroups 配置也会合并)
    const { override = {}, forceSplitting } = jsStrategyOptions || {}

    let forceSplittingGroups: CacheGroups = {}

    if (forceSplitting) {
      forceSplittingGroups = getForceSplittingGroups(forceSplitting)
    }

    if (jsStrategy === 'bigVendors') {
      memo.optimization.splitChunks({
        ...override,
        cacheGroups: {
          defaultVendors: {
            name: 'chunk-vendors',
            test: NODE_MODULES_REGEX,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
          ...forceSplittingGroups,
          ...override.cacheGroups,
        },
      })
    }
    if (jsStrategy === 'depPerChunk') {
      memo.optimization.splitChunks({
        minSize: 0,
        maxInitialRequests: Number.POSITIVE_INFINITY,
        chunks: 'all',
        ...override,
        cacheGroups: {
          ...forceSplittingGroups,
          vendors: {
            priority: -9,
            test: NODE_MODULES_REGEX,
            name(module) {
              if (
                module?.type !== 'javascript/auto' &&
                module?.type !== 'javascript/esm'
              ) {
                return
              }

              return module
                ? getPackageNameFromModulePath(module.context!)
                : undefined
            },
          },
          ...override.cacheGroups,
        },
      })
    }

    if (jsStrategy === 'granularChunks') {
      const DEFAULT_FRAMEWORK_BUNDLES =
        api.appData.framework === 'react'
          ? [
              'react-dom',
              'react',
              'history',
              'react-router',
              'react-router-dom',
              'scheduler',
              'axios',
            ]
          : [
              'vue',
              'vue-router',
              'axios',
              '@vue/shared',
              '@vue/runtime-dom',
              '@vue/compiler-sfc',
              '@vue/runtime-core',
            ]

      const FRAMEWORK_BUNDLES =
        jsStrategyOptions?.frameworkBundles ?? DEFAULT_FRAMEWORK_BUNDLES

      memo.optimization.splitChunks({
        maxInitialRequests: 25,
        minSize: 20000,
        // 5MB
        // 设置最大块大小为5MB，超过此大小的块将被分割
        maxSize: 5 * 1024 * 1024,
        ...override,
        cacheGroups: {
          polyfill: {
            chunks: 'all',
            name: 'polyfill',
            test: new RegExp(
              `[\\\\/]node_modules[\\\\/](${[
                'core-js',
                'regenerator-runtime',
                'tslib',
                '@babel/runtime',
                'core-js-pure',
                '@swc/helpers',
              ].join('|')})[\\\\/]`,
            ),
            priority: 70,
          },
          framework: {
            chunks: 'all',
            name: 'framework',
            test: new RegExp(
              `[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join(
                '|',
              )})[\\\\/]`,
            ),
            priority: 60,
            // 最小 20kb, 因为 电商配置了 autoExternal 会自动将 react/react-dom 打包在一起 framework 内容会比较少
            minSize: 20000,
            // enforce: true,
          },
          // https://github.com/web-infra-dev/rspack/issues/7269 还需要 rspack 支持
          lib: {
            test(module): boolean {
              if (!(module instanceof NormalModule)) {
                return false
              }
              const name = module.nameForCondition()
              // 优化判断逻辑,提高可读性
              const isCSS =
                module.type.startsWith('css') ||
                module.rawRequest.endsWith('.less') ||
                module.rawRequest.endsWith('?modules') ||
                isModuleCSS(module)

              const isNodeModule = NODE_MODULES_REGEX.test(name || '')
              return !isCSS && isNodeModule
            },
            name(module: any) {
              const name = module.nameForCondition()
              const libIdent = module.libIdent({ context: api.cwd })
              const moduleInfo = resolveNodeModulePath(
                name || libIdent,
                api.cwd,
              )

              if (moduleInfo?.moduleName) {
                return `lib-${getModuleName(moduleInfo.moduleName)}`
              }

              const hash = crypto.createHash('sha1')

              if (libIdent) {
                hash.update(libIdent)
                return `lib-${hash.digest('hex').substring(0, 8)}`
              }

              // 回退使用 identifier
              const identifier = module.identifier()
              const nodeModulesMatch = /(?:^|[/\\])node_modules[/\\](.*)/.exec(
                identifier,
              )
              const modulePath = nodeModulesMatch?.[1] || identifier

              hash.update(modulePath)
              return `lib-${hash.digest('hex').substring(0, 8)}`
            },
            chunks: 'async',
            priority: 55,
            minChunks: 1,
            reuseExistingChunk: true,
            minSize: 160000,
          },
          ...forceSplittingGroups,
          ...override.cacheGroups,
        },
      })
    }

    return memo
  })
}

function getForceSplittingGroups(forceSplitting: ForceSplitting): CacheGroups {
  const cacheGroups: CacheGroups = {}
  const pairs = Array.isArray(forceSplitting)
    ? forceSplitting.map(
        (regexp, index) => [`force-split-${index}`, regexp] as const,
      )
    : Object.entries(forceSplitting)

  for (const [key, regexp] of pairs) {
    cacheGroups[key] = {
      test: regexp,
      name: key,
      chunks: 'all',
      priority: 49,
      // Ignore minimum size, minimum chunks and maximum requests and always create chunks.
      enforce: true,
    }
  }

  return cacheGroups
}

const MODULE_PATH_REGEX: RegExp =
  /.*[\\/]node_modules[\\/](?!\.pnpm[\\/])(?:(@[^\\/]+)[\\/])?([^\\/]+)/

function getPackageNameFromModulePath(modulePath: string): string | undefined {
  const handleModuleContext = modulePath?.match(MODULE_PATH_REGEX)

  if (!handleModuleContext) {
    return undefined
  }

  const [, scope, name] = handleModuleContext
  const packageName = ['npm', (scope ?? '').replace('@', ''), name]
    .filter(Boolean)
    .join('.')

  return packageName
}

const isModuleCSS = (module: { type: string }): boolean => {
  return (
    // mini-css-extract-plugin
    module.type === 'css/mini-extract' ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === 'css/extract-chunks' ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === 'css/extract-css-chunks'
  )
}

// 获取模块名称
const getModuleName = (name: string) => {
  return (
    name
      // 替换 @scope/pkg 为 scope-pkg 格式
      .replace(/^@(\w+)[/\\]/, '$1-')
      .replace(/^@/, 'at-')
      // 替换 . 为 _
      .replace(/\./g, '_')
      // 替换 / 为 -
      .replace(/\//g, '-')
      // 移除开头的 ./ 或 ../
      .replace(/^[./\\]+/, '')
      // rspack 不支持 $，替换为 d__
      .replace(/^.(\/|\\)/, '')
      .replace(/(\/|\\)/g, '__')
      .replace(/\.\.__/g, '')
      .replace(/\$/, 'd__')
      .replace(/[\[\]]/g, '')
  )
}
