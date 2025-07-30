import { Mustache } from '@kmijs/shared'
import type { IApi } from '@kmijs/types'

type TransformImport = Array<{
  libraryName: string
  libraryDirectory?: string
  style?: string | boolean
  styleLibraryDirectory?: string
  camelToDashComponentName?: boolean
  transformToDefaultImport?: boolean
  customName?: string
  customStyleName?: string
}>

export default (api: IApi) => {
  api.describe({
    key: 'transformImport',
    config: {
      schema({ zod }) {
        return zod
          .array(
            zod.object({
              libraryName: zod.string().describe('需要转换的库名'),
              libraryDirectory: zod
                .string()
                .optional()
                .describe(
                  '用于拼接转换后的路径，默认值 lib 拼接规则为 ${libraryName}/${libraryDirectory}/${member}，其中 member 为引入成员。',
                ),

              style: zod
                .union([zod.string(), zod.boolean()])
                .optional()
                .describe(
                  '确定是否需要引入相关样式，若为 true，则会引入路径 ${libraryName}/${libraryDirectory}/${member}/style。若为 false 或 undefined 则不会引入样式。',
                ),
              styleLibraryDirectory: zod
                .string()
                .optional()
                .describe(
                  '该配置用于拼接引入样式时的引入路径，若该配置被指定，则 style 配置项会被忽略。拼接引入路径为 ${libraryName}/${styleLibraryDirectory}/${member}。',
                ),
              camelToDashComponentName: zod
                .boolean()
                .optional()
                .describe(
                  '是否需要将 camelCase 的引入转换成 kebab-case。默认 true ',
                ),
              transformToDefaultImport: zod
                .boolean()
                .optional()
                .describe('是否将导入语句转换成默认导入。默认 true'),
              customName: zod
                .string()
                .optional()
                .describe('自定义转换后的导入路径。'),
              customStyleName: zod
                .string()
                .optional()
                .describe(
                  '自定义转换后的样式导入路径，用法与 customName 一致。',
                ),
            }),
          )
          .describe(
            '转换 import 的路径，可以用于模块化引用三方包的子路径，能力类似于 babel-plugin-import',
          )
      },
    },
    enableBy: api.EnableBy.config,
  })

  api.addExtraBabelPlugins(() => {
    if (api.config.rspack) {
      return []
    }
    const transformImport = api.config.transformImport as TransformImport
    return transformImport.map((item) => {
      const {
        libraryName,
        libraryDirectory,
        camelToDashComponentName,
        style,
        transformToDefaultImport,
        customName,
        customStyleName,
      } = item
      const importOpts: Record<string, any> = {
        libraryName,
        libraryDirectory,
        camel2DashComponentName: camelToDashComponentName,
        style,
        transformToDefaultImport,
      }

      if (typeof style === 'string' && style.includes('{{')) {
        importOpts.style = (member: string) => {
          return Mustache.render(style, { member })
        }
      }

      if (customName) {
        importOpts.customName = (member: string) => {
          return Mustache.render(customName, { member })
        }
      }

      if (customStyleName) {
        importOpts.customStyleName = (member: string) => {
          return Mustache.render(customStyleName, { member })
        }
      }

      return [
        require.resolve('../../../compiled/babel-plugin-import'),
        importOpts,
        libraryName,
      ]
    })
  })

  api.modifySwcLoaderOptions((memo) => {
    const { transformImport } = api.config
    if (transformImport) {
      memo.rspackExperiments ??= {}
      memo.rspackExperiments.import ??= []
      memo.rspackExperiments.import.push(...transformImport)
    }
    return memo
  })
}
