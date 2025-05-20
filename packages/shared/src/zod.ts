import type { z } from '../compiled/zod'

export function isZodSchema<T extends z.ZodType<any>>(schema: T): boolean {
  return 'safeParse' in schema
}

export * as zod from '../compiled/zod'
export * as zodValidationError from '../compiled/zod-validation-error'
