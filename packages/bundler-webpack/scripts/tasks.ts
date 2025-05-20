import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fsExtra as fs, logger } from '@kmijs/shared'
import { globbySync } from 'globby'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonExternals: Record<string, string> = {
  'schema-utils': '@kmijs/bundler-compiled/compiled/schema-utils',
  'source-map': '@kmijs/bundler-compiled/compiled/source-map',
  'html-entities': '@kmijs/bundler-compiled/compiled/html-entities',
  'ansi-html': '@kmijs/bundler-compiled/compiled/ansi-html',
  'error-stack-parser': '@kmijs/bundler-compiled/compiled/error-stack-parser',

  // fork-ts-checker-webpack-plugin
  '@babel/code-frame': '@kmijs/bundler-compiled/compiled/babel/code-frame',
  chalk: '@kmijs/shared/compiled/chalk',
  chokidar: '@kmijs/shared/compiled/chokidar',
  deepmerge: '@kmijs/shared/compiled/deepmerge',
  'fs-extra': '@kmijs/shared/compiled/fs-extra',
  minimatch: '@kmijs/shared/compiled/minimatch',
  memfs: '@kmijs/bundler-compiled/compiled/memfs',
  semver: '@kmijs/shared/compiled/semver',
  tapable: '@kmijs/bundler-shared/tapable',
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
    pkgName: '@pmmmwh/react-refresh-webpack-plugin',
    // @pmmmwh/react-refresh-webpack-plugin 预打包依赖, html-entities, ansi-html, error-stack-parser
    patch: () => {
      // 复制 @pmmmwh/react-refresh-webpack-plugin 插件，同时确保所有依赖都已打包
      const pkgPath = path.join(
        __dirname,
        '../node_modules/@pmmmwh/react-refresh-webpack-plugin',
      )
      const filePaths = globbySync(['**/*'], {
        cwd: pkgPath,
        ignore: ['node_modules', 'types', 'README.md'],
      })
      filePaths.forEach((filePath) => {
        fs.ensureDirSync(
          path.join(
            __dirname,
            `../compiled/@pmmmwh/react-refresh-webpack-plugin/${path.dirname(
              filePath,
            )}`,
          ),
        )
        const sourcePath = path.join(pkgPath, filePath)
        const targetPath = path.join(
          __dirname,
          `../compiled/@pmmmwh/react-refresh-webpack-plugin/${filePath}`,
        )
        if (path.extname(filePath) === '.js') {
          const fileContent = fs.readFileSync(sourcePath, 'utf8')
          // 为 react-refresh-webpack-plugin 添加 source-map，同时其他依赖也需要打包它
          fs.writeFileSync(
            targetPath,
            replaceDeps(fileContent, commonExternals),
          )
        } else {
          fs.copyFileSync(sourcePath, targetPath)
        }
      })
      // 覆盖 RefreshUtils.js，该文件可以为 kmi 的一些能力做定制
      // fs.copyFileSync(
      //   path.join(__dirname, '../override/RefreshUtils.js'),
      //   path.join(pkgPath, 'lib/runtime/RefreshUtils.js'),
      // )
    },
  },
  {
    pkgName: 'fork-ts-checker-webpack-plugin',
    patch: () => {
      // 预打包依赖 cosmiconfig, node-abort-controller
      const pkgName = 'fork-ts-checker-webpack-plugin'
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
            cosmiconfig: '../../../compiled/cosmiconfig',
            'node-abort-controller':
              '../../../../compiled/node-abort-controller',
          }
          fs.writeFileSync(targetPath, replaceDeps(fileContent, externals))
        } else {
          fs.copyFileSync(sourcePath, targetPath)
        }
      })

      // 覆盖 fork-ts-checker-webpack-plugin/lib/issue/issue-match.js 默认打包的不是 es module
      const targetPath = path.join(__dirname, `../compiled/${pkgName}`)
      fs.copyFileSync(
        path.join(__dirname, './override/issue-match.js'),
        path.join(targetPath, 'lib/issue/issue-match.js'),
      )
      logger.info('override', 'lib/issue/issue-match.js')
    },
  },
]

export default tasks
