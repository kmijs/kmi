import { importLazy } from '@kmijs/shared'

const babelCodeFrame: typeof import('../compiled/babel/code-frame') =
  importLazy(require.resolve('../compiled/babel/code-frame'))

type Errors = {
  location?: {
    line: number
    column: number
  }
  text: string
}[]

export function prettyPrintEsBuildErrors(
  errors: Errors,
  opts: { content: string; path: string },
) {
  for (const error of errors) {
    if (error.location?.line && error.location?.column) {
      // @ts-ignore
      const message = babelCodeFrame.codeFrameColumns(
        opts.content,
        {
          start: {
            line: error.location.line,
            column: error.location.column,
          },
        },
        {
          message: error.text,
          highlightCode: true,
        },
      )
      console.log(`\n${opts.path}:\n${message}\n`)
    }
  }
}
