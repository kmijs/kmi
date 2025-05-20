import { getSchemas as getCommonSchemas } from '@kmijs/bundler-compiled'
import type { zod as z } from '@kmijs/shared'
import { Transpiler } from './types'

export function getSchemas(): Record<
  string,
  (arg: { zod: typeof z }) => z.ZodType<any>
> {
  return {
    ...getCommonSchemas(),
    srcTranspiler: ({ zod }) => zod.enum([Transpiler.babel, Transpiler.swc]),
  }
}
