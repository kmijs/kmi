import path from 'node:path'

// `[drive_letter]:\` + `\\[server]\[share_name]\`
const IS_NATIVE_WIN32_PATH = /^[a-z]:[/\\]|^\\\\/i

function getFileExcerptIfPossible(error: any) {
  if (typeof error.extract === 'undefined') {
    return []
  }

  const excerpt = error.extract.slice(0, 2)
  const column = Math.max(error.column - 1, 0)

  if (typeof excerpt[0] === 'undefined') {
    excerpt.shift()
  }

  excerpt.push(`${new Array(column).join(' ')}^`)

  return excerpt
}

export function errorFactory(error: any) {
  const message = [
    '\n',
    ...getFileExcerptIfPossible(error),
    error.message.charAt(0).toUpperCase() + error.message.slice(1),
    error.filename
      ? `      Error in ${path.normalize(error.filename)} (line ${
          error.line
        }, column ${error.column})`
      : '',
  ].join('\n')

  // @ts-ignore
  const obj = new Error(message, { cause: error })

  // @ts-ignore
  obj.stack = null

  return obj
}

export function isUnsupportedUrl(url: string) {
  // Is Windows path
  if (IS_NATIVE_WIN32_PATH.test(url)) {
    return false
  }

  // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
  // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)
}

export function normalizeSourceMap(map: any) {
  const newMap = map

  // map.file is an optional property that provides the output filename.
  // Since we don't know the final filename in the webpack build chain yet, it makes no sense to have it.
  // eslint-disable-next-line no-param-reassign
  delete newMap.file

  // eslint-disable-next-line no-param-reassign
  newMap.sourceRoot = ''

  // `less` returns POSIX paths, that's why we need to transform them back to native paths.
  // eslint-disable-next-line no-param-reassign
  newMap.sources = newMap.sources.map((source: string) =>
    path.normalize(source),
  )

  return newMap
}
