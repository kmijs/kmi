import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fsExtra as fs } from '@kmijs/shared'
import { globbySync } from 'globby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonExternals: Record<string, string> = {
  'schema-utils': '@kmijs/bundler-compiled/compiled/schema-utils',

  // ts-checker-rspack-plugin
  '@babel/code-frame': '@kmijs/bundler-compiled/compiled/babel/code-frame',
  '@rspack/lite-tapable': '@kmijs/bundler-shared/rspack-lite-tapable',
  chokidar: '@kmijs/shared/compiled/chokidar',
  memfs: '@kmijs/bundler-compiled/compiled/memfs',
  minimatch: '@kmijs/shared/compiled/minimatch',
  picocolors: '@kmijs/shared/compiled/picocolors',
}

function replaceDeps(code: string, externals: Record<string, string>) {
  return Object.keys(externals).reduce((acc, curr) => {
    return (
      acc
        // cjs
        .replace(
          new RegExp(`require\\(["']${curr}["']\\)`, 'g'),
          `require("${`${externals[curr]}`}")`,
        )
        // esm
        .replace(
          new RegExp(`from ["']${curr}["']`, 'g'),
          `from "${`${externals[curr]}`}"`,
        )
    )
  }, code)
}

const tasks = [
  {
    pkgName: 'ts-checker-rspack-plugin',
    patch: () => {
      const pkgName = 'ts-checker-rspack-plugin'
      const pkgPath = path.join(__dirname, `../node_modules/${pkgName}`)
      const filePaths = globbySync(['**/*'], {
        cwd: pkgPath,
        ignore: ['node_modules', 'types', 'README.md'],
      })
      filePaths.forEach((filePath) => {
        fs.ensureDirSync(
          path.join(
            __dirname,
            `../compiled/${pkgName}/${path.dirname(filePath)}`,
          ),
        )
        const sourcePath = path.join(pkgPath, filePath)
        const targetPath = path.join(
          __dirname,
          `../compiled/${pkgName}/${filePath}`,
        )
        if (path.extname(filePath) === '.js') {
          const fileContent = fs.readFileSync(sourcePath, 'utf8')
          const externals = {
            ...commonExternals,
          }
          fs.writeFileSync(targetPath, replaceDeps(fileContent, externals))
        } else {
          fs.copyFileSync(sourcePath, targetPath)
        }
      })
    },
  },
]

export default tasks
