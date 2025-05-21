import { normalize } from 'node:path'
import { callbackify } from 'node:util'
import { transform as defaultEsbuildTransform } from '@kmijs/bundler-shared/esbuild'
import type { LoaderContext } from '@kmijs/bundler-shared/rspack'
// MIT: https://github.com/gregberge/svgr/blob/main/packages/webpack/src/index.ts
// TODO: prebuild @svgr/core @svgr/plugin-jsx @svgr/plugin-svgo
import { type Config, type State, transform } from '../compiled/@svgr/core'
import jsx from '../compiled/@svgr/plugin-jsx'
import svgo from '../compiled/@svgr/plugin-svgo'

const tranformSvg = callbackify(
  async (contents: string, options: Config, state: Partial<State>) => {
    const jsCode = await transform(contents, options, state)
    const result = await defaultEsbuildTransform(jsCode, {
      loader: 'tsx',
      target: 'es2015',
    })
    if (!result?.code) {
      throw new Error('Error while transforming using Esbuild')
    }
    return result.code
  },
)

function svgrLoader(this: LoaderContext<Config>, contents: string): void {
  this.cacheable?.()
  const callback = this.async()

  const options = this.getOptions()

  const previousExport = (() => {
    if (contents.startsWith('export ')) return contents
    const exportMatches = contents.match(/^module.exports\s*=\s*(.*)/)
    return exportMatches ? `export default ${exportMatches[1]}` : null
  })()

  const state = {
    caller: {
      name: 'svgr-loader',
      previousExport,
      defaultPlugins: [svgo, jsx],
    },
    filePath: normalize(this.resourcePath),
  }

  if (!previousExport) {
    tranformSvg(contents, options, state, callback)
  } else {
    // @ts-expect-error
    this.fs.readFile(this.resourcePath, (err, result) => {
      if (err) {
        callback(err)
        return
      }
      tranformSvg(String(result), options, state, callback)
    })
  }
}

export default svgrLoader
