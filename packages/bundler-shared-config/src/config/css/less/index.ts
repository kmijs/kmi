import path from 'node:path'
import type { LoaderContext } from '@kmijs/bundler-shared/rspack'
import ParalleLessPlugin from './ParalleLessPlugin'
import { LessLoaderOptionsSchema } from './options'
import { createParallelLoader } from './parallelLessLoader'
import { errorFactory, isUnsupportedUrl, normalizeSourceMap } from './utils'

declare module '@kmijs/bundler-shared/rspack' {
  interface Compilation {
    __parallelLessLoader?: ReturnType<typeof createParallelLoader>
    __parallelLessPluginRegistered?: boolean
  }
}

export interface LessOptions {
  modifyVars?: Record<string, string>
  globalVars?: Record<string, string>
  math?:
    | 'always'
    | 'strict'
    | 'parens-division'
    | 'parens'
    | 'strict-legacy'
    | number
    | undefined

  /**
   * A plugin can be a file path string, or a file path string with a params object.
   * Notice! The file path should be a resolved path like require.resolve("less-plugin-clean-css"),
   * and the params object must be a plain json. We will require the plugin file to get the plugin content.
   * If the params object been accepted, that means, the required content will be treated as a factory class of Less.Plugin,
   * we will create a plugin instance with the params object, or else, the required content will be treated as a plugin instance.
   * We do this because the less loader runs in a worker pool for speed, and a less plugin instance can't be passed to worker directly.
   */
  plugins?: (string | [string, Record<string, any>])[]
  sourceMap?: Record<string, any>
  filename?: string
}

export interface LessLoaderOpts {
  lessOptions:
    | LessOptions
    | ((loaderContext: LoaderContext<LessLoaderOpts>) => LessOptions)
  // Enables/Disables generation of source maps. https://github.com/webpack-contrib/less-loader#sourcemap
  sourceMap?: boolean
  /**
   * 添加额外的数据到 less 文件中
   */
  additionalData?:
    | string
    | ((data: string, loaderContext: LoaderContext<LessLoaderOpts>) => string)
}

function getLessOptions(
  loaderContext: LoaderContext<LessLoaderOpts>,
  loaderOptions: LessLoaderOpts,
) {
  const options =
    typeof loaderOptions.lessOptions === 'function'
      ? loaderOptions.lessOptions(loaderContext) || {}
      : loaderOptions.lessOptions || {}
  return options
}

async function lessLoader(this: LoaderContext<LessLoaderOpts>, source: string) {
  const options = this.getOptions(LessLoaderOptionsSchema)
  const callback = this.async()

  const userLessOptions = getLessOptions(this, options)

  const lessOptions: LessOptions = {
    // We need to set the filename because otherwise our WebpackFileManager will receive an undefined path for the entry
    filename: this.resourcePath,
    ...userLessOptions,
  }

  const useSourceMap =
    typeof options.sourceMap === 'boolean' ? options.sourceMap : this.sourceMap

  if (useSourceMap) {
    lessOptions.sourceMap = {
      outputSourceFiles: true,
    }
  }

  let content = source

  if (typeof options.additionalData !== 'undefined') {
    content =
      typeof options.additionalData === 'function'
        ? `${await options.additionalData(source, this)}`
        : `${options.additionalData}\n${source}`
  }

  let result: { css: string; imports: string[]; map: any }
  try {
    const compiler = this._compiler
    this._compilation.__parallelLessLoader ||= createParallelLoader(this)

    const parallelLessLoader = this._compilation.__parallelLessLoader

    // 在 Compilation 对象上注册自定义插件
    if (!this._compilation.__parallelLessPluginRegistered) {
      this._compilation.__parallelLessPluginRegistered = true
      new ParalleLessPlugin().apply(compiler)
    }

    result = await parallelLessLoader.run({
      content,
      opts: lessOptions,
      alias: compiler.options.resolve.alias as Record<string, any>,
      modules: compiler.options.resolve.modules || ['node_modules'],
      context: this.context || this.rootContext,
      cwd: this.rootContext,
    })
  } catch (error: any) {
    if (error.filename) {
      // `less` returns forward slashes on windows when `webpack` resolver return an absolute windows path in `WebpackFileManager`
      // Ref: https://github.com/webpack-contrib/less-loader/issues/357
      this.addDependency(path.normalize(error.filename))
    }
    callback(errorFactory(error))
    return
  }

  const { css, imports } = result

  imports.forEach((item) => {
    if (isUnsupportedUrl(item)) {
      return
    }

    // `less` return forward slashes on windows when `webpack` resolver return an absolute windows path in `WebpackFileManager`
    // Ref: https://github.com/webpack-contrib/less-loader/issues/357
    const normalizedItem = path.normalize(item)

    // Custom `importer` can return only `contents` so item will be relative
    if (path.isAbsolute(normalizedItem)) {
      this.addDependency(normalizedItem)
    }
  })

  let map = typeof result.map === 'string' ? JSON.parse(result.map) : result.map

  if (map && useSourceMap) {
    map = normalizeSourceMap(map)
  }

  callback(null, css, map)
}

export default lessLoader
