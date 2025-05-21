import type { zod as Zod } from '@kmijs/shared'
import type { IApi } from './api'

/**
 * 声明一个单个 kmi 配置对应 describe 中的 config.schema
 */
export type DefineKmiConfigSchema = ({ zod }: { zod: typeof Zod }) => Zod.Schema

/**
 * 声明一组 kmi 配置
 */
export interface DefineKmiConfigSchemaObject {
  [key: string]: DefineKmiConfigSchema
}

/**
 * 注册插件配置
 * @param schema config zod schema 定义
 * @param configDefaults config 默认值
 * @param api IApi
 */
export function registerKmiConfig(
  schema: DefineKmiConfigSchemaObject,
  configDefaults: Record<string, any>,
  api: IApi,
): void {
  for (const key of Object.keys(schema)) {
    const config: Record<string, DefineKmiConfigSchema> = {
      schema: schema[key],
    }

    // 默认值
    if (key in configDefaults) {
      config.default = configDefaults[key]
    }

    // change type is regenerateTmpFiles
    if (['routes'].includes(key)) {
      // @ts-expect-error
      config.onChange = api.ConfigChangeType.regenerateTmpFiles
    }

    api.registerPlugins([
      {
        id: `virtual: config-${key}`,
        key: key,
        config,
      },
    ])
  }
}

/**
 * 定义插件配置 schema
 * @param schema config zod schema 定义
 * @returns config zod schema 定义
 */
export function defineKmiConfigSchema(
  schema: DefineKmiConfigSchemaObject,
): DefineKmiConfigSchemaObject {
  return schema
}
