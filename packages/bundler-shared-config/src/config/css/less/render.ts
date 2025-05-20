import path from 'node:path'
import less from '@kmijs/bundler-shared/compiled/less'
import type { LessOptions } from '.'
import { errorFactory } from './utils'

// 这里不使用 oxc-resolver 的原因在 流水线 node 16 环境下开启 less worker，oxc-resolver 会报 Segmentation fault
const enhancedResolve = require('../../../../compiled/enhanced-resolve')

const { parentPort } = require('node:worker_threads')

const addDependency = (filename: string) => {
  parentPort?.postMessage({ type: 'addDependency', filename })
}

module.exports = async function render(param: {
  content: string
  opts: LessOptions
  alias: Record<string, any>
  context: string
  modules: string[]
  cwd: string
}): Promise<Less.RenderOutput> {
  const { modifyVars, globalVars, math, sourceMap, plugins, filename } =
    param.opts
  const input = param.content

  const pluginInstances: Less.Plugin[] | undefined =
    plugins?.map((p) => {
      if (Array.isArray(p)) {
        const pluginModule = require(p[0])
        const PluginClass = pluginModule.default || pluginModule
        return new PluginClass(p[1])
      }
      return require(p)
    }) || []

  pluginInstances.unshift(
    createWebpackLessPlugin(
      param.alias,
      less,
      param.context,
      param.modules,
      param.cwd,
    ),
  )

  const lessOptions = {
    javascriptEnabled: true,
    plugins: pluginInstances,
    relativeUrls: true,
    filename,
    ...(math && { math }),
    ...(globalVars && { globalVars }),
    ...(sourceMap && { sourceMap }),
    ...(modifyVars && { modifyVars }),
  } as unknown as Less.Options

  const result = await less.render(input, lessOptions).catch((err: any) => {
    if (err.filename) {
      addDependency(path.normalize(err.filename))
    }
    throw errorFactory(err)
  })
  return result
}

// `[drive_letter]:\` + `\\[server]\[share_name]\`
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i
const MODULE_REQUEST_REGEX = /^[^?]*~/

// Examples:
// - ~package
// - ~package/
// - ~@org
// - ~@org/
// - ~@org/package
// - ~@org/package/
const IS_MODULE_IMPORT =
  /^~([^/]+|[^/]+\/|@[^/]+[/][^/]+|@[^/]+\/?|@[^/]+[/][^/]+\/)$/

// This somewhat changed in Less 3.x. Now the file name comes without the
// automatically added extension whereas the extension is passed in as `options.ext`.
// So, if the file name matches this regexp, we simply ignore the proposed extension.
const IS_SPECIAL_MODULE_IMPORT = /^~[^/]+$/

const createResolver = (
  alias: Record<string, any>,
  modules: string[],
  cwd: string,
) => {
  const resolver = enhancedResolve.create({
    alias,
    dependencyType: 'less',
    conditionNames: ['less', 'style', '...'],
    mainFields: ['less', 'style', 'main', '...'],
    mainFiles: ['index', '...'],
    extensions: ['.less', '.css'],
    preferRelative: true,
    modules,
    roots: [cwd],
  })

  async function resolve(context: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolver(context, path, (err: Error, result: string) =>
        err ? reject(err) : resolve(result),
      )
    })
  }
  return { resolve }
}

function createWebpackLessPlugin(
  alias: Record<string, any>,
  implementation: LessStatic,
  context: string,
  modules: string[],
  cwd: string,
) {
  const { resolve } = createResolver(alias, modules, cwd)

  // @ts-ignore
  class WebpackFileManager extends implementation.FileManager {
    supports(filename: string) {
      if (filename[0] === '/' || IS_NATIVE_WIN32_PATH.test(filename)) {
        return true
      }

      if (this.isPathAbsolute(filename)) {
        return false
      }

      return true
    }

    // Sync resolving is used at least by the `data-uri` function.
    // This file manager doesn't know how to do it, so let's delegate it
    // to the default file manager of Less.
    // We could probably use loaderContext.resolveSync, but it's deprecated,
    // see https://webpack.js.org/api/loaders/#this-resolvesync
    supportsSync() {
      return false
    }

    async resolveFilename(filename: string) {
      // Less is giving us trailing slashes, but the context should have no trailing slash
      let request = filename

      // A `~` makes the url an module
      if (MODULE_REQUEST_REGEX.test(filename)) {
        request = request.replace(MODULE_REQUEST_REGEX, '')
      }

      if (IS_MODULE_IMPORT.test(filename)) {
        request = request[request.length - 1] === '/' ? request : `${request}/`
      }

      return this.resolveRequests(context, [...new Set([request, filename])])
    }

    async resolveRequests(
      context: string,
      possibleRequests: any[],
    ): Promise<string> {
      if (possibleRequests.length === 0) {
        return Promise.reject()
      }

      let result: string

      try {
        result = await resolve(context, possibleRequests[0])
      } catch (error) {
        const [, ...tailPossibleRequests] = possibleRequests

        if (tailPossibleRequests.length === 0) {
          throw error
        }

        result = await this.resolveRequests(context, tailPossibleRequests)
      }

      return result
    }

    async loadFile(filename: string, ...args: any[]) {
      let result: string | Less.FileLoadResult

      try {
        if (IS_SPECIAL_MODULE_IMPORT.test(filename)) {
          const error = new Error() as any

          error.type = 'Next'

          throw error
        }

        //@ts-expect-error
        result = await super.loadFile(filename, ...args)
      } catch (error: any) {
        if (error.type !== 'File' && error.type !== 'Next') {
          return Promise.reject(error)
        }

        try {
          // @ts-expect-error
          result = await this.resolveFilename(filename, ...args)
        } catch (webpackResolveError: any) {
          error.message =
            `Less worker resolver error:\n${error.message}\n\n` +
            `Kmi Rspack less worker resolver error details:\n${webpackResolveError.details}\n\n` +
            `Kmi Rspack less worker resolver error missing:\n${webpackResolveError.missing}\n\n`

          return Promise.reject(error)
        }

        addDependency(result)

        // @ts-expect-error
        return super.loadFile(result, ...args)
      }

      const absoluteFilename = path.isAbsolute(result.filename)
        ? result.filename
        : path.resolve('.', result.filename)

      addDependency(path.normalize(absoluteFilename))

      return result
    }
  }

  return {
    install(_lessInstance, pluginManager) {
      pluginManager.addFileManager(new WebpackFileManager())
    },
    minVersion: [3, 0, 0],
  } as Less.Plugin
}
