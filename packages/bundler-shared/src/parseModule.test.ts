import fs from 'node:fs'
import path from 'node:path'
import { logger } from '@kmijs/shared'
import { describe, expect, test, vitest } from 'vitest'
import { parseModule } from './parseModule'

vitest.mock('@kmijs/shared', () => ({
  logger: {
    error: vitest.fn(),
  },
}))

function indexToLineColumn(code: string, index: number) {
  let line = 1
  let column = 0

  for (let i = 0; i < index; i++) {
    if (code[i] === '\n') {
      line++
      column = 0
    } else {
      column++
    }
  }

  return { line, column }
}

describe('parseModule', () => {
  test('should parse module successfully', async () => {
    const content = fs.readFileSync(
      path.join(__dirname, '../fixtures/layout.txt'),
      'utf-8',
    )
    const result = await parseModule({
      path: 'layout.tsx',
      content,
    })

    expect(result).toBeDefined()

    expect(indexToLineColumn(content, result.imports[2].s)).toMatchObject({
      line: 16,
      column: 32,
    })
    expect(result.exports.map((item) => item.n)).toEqual(['default'])
  })

  test('should log error and throw when parsing fails', async () => {
    await expect(
      parseModule({
        path: 'x.jsx',
        content: `
        export function Foo() {
          return (\`\`
            <div />
          );
        }
        `,
      }),
    ).rejects.toThrow()

    expect(logger.error).toHaveBeenCalledWith('parse x.jsx failed')
  })
})
