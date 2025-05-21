import { defineKmiConfigSchema } from '@kmijs/types'

export const schema = defineKmiConfigSchema({
  lightningcssLoader: ({ zod }) =>
    zod.object({}).describe('lightningcss loader 配置'),
  swcLoader: ({ zod }) => zod.object({}).describe('swc loader 配置'),
  javascriptExportsPresence: ({ zod }) =>
    zod
      .boolean()
      .optional()
      .describe('关闭不存在的导出或存在冲突的重导出时报错校验, 默认开启'),
})

export const configDefaults: Record<string, any> = {}
