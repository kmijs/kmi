import fs from 'node:fs'
import path from 'node:path'
import { glob } from '@kmijs/shared'
import { createKmi } from '@scripts/test-utils'

export function isFile(path: string): boolean {
  try {
    const stats = fs.statSync(path)
    return stats.isFile()
  } catch (err) {
    return false
  }
}

export function createUmiMax(cwd: string) {
  const service = createKmi({
    cwd,
    plugins: [path.join(__dirname, './defaultPlugin.ts')],
    presets: [require.resolve('@umijs/max/dist/preset')],
  })

  return service
}

export function createUmi(cwd: string) {
  const service = createKmi({
    cwd,
    plugins: [path.join(__dirname, './defaultPlugin.ts')],
  })
  return service
}

export const globContentJSON = async (
  distPath: string,
  options: glob.IOptions,
) => {
  const files = await glob.sync(path.join(distPath, '**/*'), options)
  const ret: Record<string, string> = {}
  await Promise.all(
    files
      .filter((item) => isFile(item))
      .map((file) =>
        fs.promises.readFile(file, 'utf-8').then((content) => {
          const filePath = path.relative(distPath, file)
          ret[filePath] = content
        }),
      ),
  )

  return ret
}

export const unwrapOutputJSON = async (distPath: string, ignoreMap = true) => {
  return globContentJSON(distPath, {
    absolute: true,
    ignore: ignoreMap ? [path.join(distPath, '/**/*.map')] : [],
  })
}
