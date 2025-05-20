import { logger } from '@kmijs/shared'
import { type ParseResult, parse, parseAsync } from 'rs-module-lexer'

export type ParseModuleResult = ParseResult

export async function parseModule(opts: {
  content: string
  path: string
}): Promise<ParseResult> {
  try {
    const { output } = await parseAsync({
      input: [
        {
          filename: opts.path,
          code: opts.content,
        },
      ],
    })
    return output[0]
  } catch (err) {
    logger.error(`parse ${opts.path} failed`)
    throw err
  }
}

export function parseModuleSync(opts: {
  content: string
  path: string
}): ParseResult {
  try {
    const { output } = parse({
      input: [
        {
          filename: opts.path,
          code: opts.content,
        },
      ],
    })
    return output[0]
  } catch (err) {
    logger.error(`parse ${opts.path} failed`)
    throw err
  }
}
