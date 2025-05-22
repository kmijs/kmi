import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { expect, test } from 'vitest'
import { build } from './build'

interface IOpts {
  files: Record<string, string>
}

const EXISTS = '1'

const expects: Record<string, (opts: IOpts) => void> = {
  alias({ files }: IOpts) {
    expect(files['index.js']).toContain(`var a = 'react';`)
  },
  'asset-avif'({ files }: IOpts) {
    expect(files['index.js']).toContain(`.avif"`)
  },
  'asset-base64'({ files }: IOpts) {
    expect(files['index.css']).toContain('data:image/svg+xml;base64,P')
  },
  'asset-fallback'({ files }: IOpts) {
    expect(files['index.js']).toContain(`.mp3"`)
  },
  'asset-image-large'({ files }: IOpts) {
    expect(files['index.js']).toContain(`.png"`)
  },
  'asset-image-small'({ files }: IOpts) {
    expect(files['index.js']).toContain(`"data:image/png;base64,`)
  },
  chainWebpack({ files }: IOpts) {
    expect(files['index.js']).toContain(`const a = 'react';`)
  },
  copy({ files }: IOpts) {
    expect(files['a.js']).toContain(`console.log('copy');`)
  },
  'copy-from-assets'({ files }: IOpts) {
    expect(files['foo.json']).toContain(EXISTS)
    expect(files['bar.json']).toContain(EXISTS)
    expect(files.assets).toContain(EXISTS)
    expect(files['foo-copy.json']).toContain(EXISTS)
  },
  'css-modules'({ files }: IOpts) {
    expect(files['index.js']).toContain(`a_module = ({"a":"`)
  },
  'css-modules-auto'({ files }: IOpts) {
    expect(files['index.js']).toContain(`const amodules = ({"a":"`)
  },
  'css-side-effects'({ files }: IOpts) {
    expect(files['index.css']).toContain('color: red;')
  },
  'fully-specified'({ files }: IOpts) {
    expect(files['index.js']).toContain(`console.log("a")`)
  },
  define({ files }: IOpts) {
    expect(files['index.js']).toContain(`console.log("1");`)
    expect(files['index.js']).toContain(`console.log("2");`)
    expect(files['index.js']).toContain(`console.log("3");`)
    expect(files['index.js']).toContain(`console.log("test");`)
  },
  externals({ files }: IOpts) {
    expect(files['index.js']).toContain(
      'const external_React_namespaceObject = React;',
    )
  },
  'extra-babel-includes'({ files }: IOpts) {
    const dist = files['index.js']

    // jsx
    expect(dist).toContain('Fragment, null, "JSX"')

    // unicode regex
    expect(dist).not.toContain('p{Punctuation}/ug')

    // class decorator
    expect(dist).toContain('Person.prototype, "name", null')
  },
  json({ files }: IOpts) {
    expect(files['index.js']).toContain(
      `var react_namespaceObject = {"foo":"react"}`,
    )
  },
  mdx({ files }: IOpts) {
    expect(files['index.js']).toContain('# foo')
  },
  'node-polyfill'({ files }: IOpts) {
    expect(files['index.js']).toContain('join: function join() {')
    expect(files['index.js']).toContain('__webpack_require__.g.foo')
  },
  'node-prefix'({ files }: IOpts) {
    expect(files['index.js']).toContain('exports.join = function() {')
    expect(files['index.js']).toContain('__webpack_require__.g.foo')
  },
  'postcss-autoprefixer'({ files }: IOpts) {
    expect(files['index.css'].trim()).toContain('display: -ms-flexbox;')
  },
  'css-fallback'({ files }: IOpts) {
    expect(files['index.css'].trim()).toContain('display: -ms-flexbox;')
    expect(files['index.css'].trim()).toContain('flex: 1 1;')
  },
  'postcss-extra-postcss-plugins'({ files }: IOpts) {
    expect(files['index.css']).toContain('-webkit-overflow-scrolling: touch;')
  },
  // 'postcss-flexbugs-fixes'({ files }: IOpts) {
  //   expect(files['index.css']).toContain(`.foo { flex: 1 1; }`);
  // },
  'runtime-public-path'({ files }: IOpts) {
    expect(files['index.css']).toContain('background: url(static/')
  },
  targets({ files }: IOpts) {
    expect(files['index.js']).toContain(`var foo = 'foo';`)
  },
  swc({ files }: IOpts) {
    expect(files['index.js']).toContain(`const a = 'react';`)
    expect(files['index.js']).toContain('const myIdentity = identity;')
  },
  // TODO jest 下 oxc-resolver 在 lunux 下会报错 Segmentation fault、所以这里先跳过了后续通过 e2e 来验证
  theme({ files }: IOpts) {
    expect(files['index.css']).toContain('color: green;')
  },
  'css-inset'({ files }: IOpts) {
    expect(files['index.css']).toMatch(
      '.ant-modal-mask{z-index:1000;background-color:rgba(0,0,0,.45);height:100%;position:fixed;top:0;bottom:0;left:0;right:0}',
    )
    expect(files['index.css']).toMatch(
      '.hello{padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom);top:0;bottom:0;left:0;right:0}',
    )
  },
}

const fixtures = join(__dirname, 'fixtures')
const ver = Number.parseInt(process.version.slice(1))
for (const fixture of readdirSync(fixtures)) {
  if (fixture.startsWith('.')) continue
  const base = join(fixtures, fixture)
  if (statSync(base).isFile()) continue
  if (fixture.startsWith('x-')) continue

  // 流水线 node 16 版本 会报 worker 错误
  if (ver === 16 && fixture === 'theme') {
    continue
  }

  test(`build ${fixture}`, async () => {
    let config: Record<string, any> = {}
    try {
      config = (await import(join(base, 'config.ts'))).default
    } catch (e) {}

    // 统一设置压缩选项，只有 css-inset 测试用例需要特殊处理
    process.env.COMPRESS = fixture.includes('css-inset') ? 'false' : 'none'

    await build({
      clean: true,
      config: {
        ...config,
      },
      cwd: base,
      entry: {
        index: join(base, 'index.ts'),
      },
    })
    const fileNames = readdirSync(join(base, 'dist'))
    const files = fileNames.reduce<Record<string, string>>((memo, fileName) => {
      if (['.css', '.js', '.svg'].includes(extname(fileName))) {
        memo[fileName] = readFileSync(join(base, 'dist', fileName), 'utf-8')
      } else {
        memo[fileName] = EXISTS
      }
      return memo
    }, {})
    expects[fixture]({
      files,
    })
  })
}
