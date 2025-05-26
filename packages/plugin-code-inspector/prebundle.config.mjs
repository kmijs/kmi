import fs from 'node:fs'
import { join } from 'node:path'

function replaceDeps(code, externals) {
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

/** @type {import('prebundle').Config} */
export default {
  dependencies: [
    {
      name: 'webpack-code-inspector-plugin',
      ignoreDts: true,
      externals: {
        'code-inspector-core': '../code-inspector-core'
      },
      afterBundle(task) {
        ['inject-loader.js', 'loader.js'].forEach(file => {
          const fileContent = fs.readFileSync(join(task.depPath, 'dist', file), 'utf8')
          console.log(file,this.externals)
          fs.writeFileSync(
            join(task.distPath, file),
            replaceDeps(fileContent, this.externals),
          )
        })
      },
    },
    {
      name: 'code-inspector-core',
      ignoreDts: true,
      externals: {
        chalk: '@kmijs/shared/compiled/chalk',
        '@vue/compiler-dom': '@vue/compiler-dom',
        'portfinder': '@kmijs/shared/compiled/portfinder'
      },
      afterBundle(task) {
        // 复制客 client
        fs.cpSync(
          join(task.depPath, 'dist/client.umd.js'),
          join(task.distPath, 'client.umd.js'),
        );
      },
    }
  ],
};
