# 共享配置

:::tip 💡 提示
除非另有说明、本节中的选项适用于所有开发、构建和预览。

- <Badge type="tip" text="Kmi" /> Kmi 特有支持的
:::

## alias

- 类型：`Record<string, string>`
- 默认值：`{}`

配置别名，对 import 语句的 source 做映射。

比如：

```ts [config/config.ts]
export default defineConfig({
  alias: {
    foo: '/tmp/to/foo'
  }
})
```

然后代码里 `import 'foo'` 实际上会 `import '/tmp/to/foo'`。

有几个 Tip。

1、alias 的值最好用绝对路径，尤其是指向依赖时，记得加 `require.resolve`，比如，

```ts [⛔ config/config.ts]
export default defineConfig({
  alias: {
    foo: 'foo'
  }
})
```
```ts [✅ config/config.ts]
export default defineConfig({
  alias: {
    foo: require.resolve('foo')
  }
})
```

2、如果不需要子路径也被映射，记得加 `$` 后缀，比如

import 'foo/bar' 会被映射到 import '/tmp/to/foo/bar'

```ts [config/config.ts] {3}
export default defineConfig({
  alias: {
   foo: '/tmp/to/foo'
  }
})
```

import 'foo/bar' 会被映射到 import '/tmp/to/foo/bar'

```ts [config/config.ts] {3}
export default defineConfig({
  alias: {
   foo$: '/tmp/to/foo' // [!code ++]
  }
})
```

## assetsInclude
- 类型：`RuleSetCondition`
- 默认值：`undefined`

指定需要被视为静态资源的额外文件类型。

Kmi 默认会将常见的图片、字体、音频、视频等文件视为静态资源。通过配置 `assetsInclude`，你可以添加更多的文件类型，这些新增的静态资源将按照与内置静态资源相同的规则进行处理，详见 引用静态资源。

`assetsInclude` 的值与 `Webpack(Rspack)` loader 的 test 选项相同，可以是正则表达式、字符串、数组、逻辑条件等，详见 [Rspack RuleSetCondition](https://rspack.dev/config/module#condition)。

示例

- 将 `.json5` 文件视为静态资源：

```ts [config/config.ts]
export default defineConfig({
  assetsInclude: [/\.json5$/],  // [!code ++]
})
```

- 将多种文件类型视为静态资源

```ts [config/config.ts]
export default defineConfig({
  assetsInclude: [/\.json5$/, /\.pdf$/],  // [!code ++]
})
```

## analyze

- 类型：`object`
- 默认值：`{}`

通过指定 [`ANALYZE`](/guide/env-variables#analyze) 环境变量分析产物构成时，analyzer 插件的具体配置项，见 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin)

## base <Badge type="warning" text="配合运行时路由使用" />
- 类型：`string`
- 默认值：`/`

设置路由 base，部署项目到非根目录下时使用。

比如有路由 `/` 和 `/users`，设置 base 为 `/foo/` 后就可通过 `/foo/` 和 `/foo/users` 访问到之前的路由。

## conventionRoutes <Badge type="warning" text="仅在使用 Umi 路由生效" />

- 类型：`{ base: string; exclude: RegExp[] }`
- 默认值：`null`

约定式路由相关配置。

其中 `base` 用于设置读取路由的基础路径，比如文档站点可能会需要将其改成 `./docs`；`exclude` 用于过滤一些不需要的文件，比如用于过滤 components、models 等。

示例，

```ts [config/config.ts]
export default defineConfig({
  // 不识别 components 和 models 目录下的文件为路由
  conventionRoutes: {
    exclude: [/\/components\//, /\/models\//]
  }
})
```

## copy

- 类型：`Array<string | { from: string; to: string; }>`
- 默认值：`[]`

配置要复制到输出目录的文件或文件夹。

当配置字符串时，默认拷贝到产物目录，如：

```ts [config/config.ts] {2}
export default defineConfig({
  copy: ['foo.json', 'src/bar.json']
})
```
会产生如下产物的结构：

```ts
+ dist
  - bar.json
  - foo.json
+ src
  - bar.json
- foo.json
```

你也可以通过对象配置具体的拷贝位置，其中相对路径的起点为项目根目录：

```ts [config/config.ts] {2-5}
export default defineConfig({
  copy: [
    { from: 'from', to: 'dist/output' },
    { from: 'file.json', to: 'dist' }
  ]
})
```
此时将产生如下产物结构：

```ts
+ dist
  + output
    - foo.json
  - file.json
+ from
  - foo.json
- file.json
```

## cssMinifier
- **类型**：`string` 可选的值：`esbuild`, `cssnano`, `lightningcss`, `none`
- **默认值**：`esbuild`

配置构建时使用的 CSS 压缩工具; `none` 表示不压缩。

```ts [config/config.ts]
export default defineConfig({
  cssMinifier: 'lightningcss'
})
```

## cssMinifierOptions
- **类型**：`object`
- **默认值**：`{}`

示例

```ts [config/config.ts]
export default defineConfig({
  cssMinifier: 'esbuild',
  cssMinifierOptions: {
    minifyWhitespace: true,
    minifySyntax: true,
  },
})
```

对应 CSS 压缩的配置请查看对应的文档。

- [esbuild 参考](https://esbuild.github.io/api/#minify)
- [cssnano 参考](https://cssnano.co/docs/config-file/)
- [lightningcss 参考](https://rspack.dev/plugins/rspack/lightning-css-minimizer-rspack-plugin)

## codeSplitting

- **类型**：`CodeSplitting`
- **默认值**：`{ jsStrategy: 'granularChunks' }`

codeSplitting 用于配置 Kmi 的拆包策略。 配置项的类型 `CodeSplitting` 如下:

```ts
interface CodeSplitting {
  jsStrategy: 'bigVendors' | 'depPerChunk' | 'granularChunks'
  jsStrategyOptions?: {
    /**
     * 需要优化的 package 列表
     */
    frameworkBundles?: string[]
    /**
     * 自定义拆包配置, 此配置会和默认的拆包策略合并 (cacheGroups 配置也会合并)
     */
    override?: Exclude<SplitChunks, false>
    /**
     * 指定的模块强制拆分为一个独立的 chunk
     */
    forceSplitting?: ForceSplitting
  }
}
```

相比直接配置 Rspack(Webpack) 的 splitChunks，这是一个更加简便的方式。

### codeSplitting.jsStrategy

- **类型**：`'bigVendors' | 'depPerChunk' | 'granularChunks'`
- **默认值**：`granularChunks`

Kmi 支持设置以下几种策略

- `bigVendors` 是大 vendors 方案，会将 async chunk 里的 node_modules 下的文件打包到一起，可以避免重复。同时缺点是，1）单文件的尺寸过大，2）毫无缓存效率可言
- `depPerChunk` 和 bigVendors 类似，不同的是把依赖按 package name + version 进行拆分，算是解了 bigVendors 的尺寸和缓存效率问题。但同时带来的潜在问题是，可能导致请求较多。我的理解是，对于非大型项目来说其实还好，因为，1）单个页面的请求不会包含非常多的依赖，2）基于 HTTP/2，几十个请求不算问题。但是，对于大型项目或巨型项目来说，需要考虑更合适的方案。
- `granularChunks` 在 bigVendors 和 depPerChunk 之间取了中间值，同时又能在缓存效率上有更好的利用。无特殊场景，建议用 granularChunks 策略。

- **默认策略**
Kmi 默认采用 `granularChunks`, 如果你想使用其他拆包策略, 可以通过 `jsStrategy` 选型来指定, 比如

```ts [config/config.ts]
export default defineConfig({
  codeSplitting: {
    jsStrategy: 'depPerChunk' // [!code ++]
  }
})
```

:::tip
可以通过 `codeSplitting: false` 关闭拆包默认行为
:::

### codeSplitting.jsStrategyOptions.frameworkBundles
- **类型**：`string[]`
- **默认值**：
  - **react** 框架默认值: `['react-dom', 'react', 'history', 'react-router', 'react-router-dom', 'scheduler', 'axios']`
  - **vue** 框架默认值: `['vue', 'vue-router', 'axios', '@vue/shared', '@vue/runtime-dom', '@vue/compiler-sfc', '@vue/runtime-core']`

当前 `codeSplitting.jsStrategy` 为 `granularChunks` 时， 可以通过 `frameworkBundles` 配置项来指定 `framework` 分包所用的三方包比如


```ts [config/config.ts]
export default defineConfig({
  codeSplitting: {
    jsStrategy: 'granularChunks',
    jsStrategyOptions: {
      //  framework 增加 redux
      frameworkBundles: ['react-dom', 'react', ..., 'redux'] // [!code ++]
    }
  }
})
```

### codeSplitting.jsStrategyOptions.forceSplitting <Badge type="tip" text="Kmi" />

- **类型**：`RegExp[] | Record<string, RegExp>`
- **默认值**：`[]`

通过 `codeSplitting.jsStrategyOptions.forceSplitting` 配置项可以将指定的模块强制拆分为一个独立的 chunk。

比如将 node_modules 下的 `@m-ui/react` 库拆分到 `m-ui.js` 中：

```ts [config/config.ts]
import { createDependenciesRegExp } from 'umi/plugin-utils'

export default defineConfig({
  codeSplitting: {
    jsStrategy: 'granularChunks',
    jsStrategyOptions: {
      forceSplitting: {
        'm-ui': createDependenciesRegExp('@m-ui/react') // [!code ++]
      }
    }
  }
})
```

### codeSplitting.jsStrategyOptions.override <Badge type="tip" text="Kmi" />

- **类型**：`SplitChunks`
- **默认值**：`{}`

可以通过 `codeSplitting.override` 配置项来自定义 Rspack(Webpack) 拆包配置, 此配置会和 Rspack(Webpack) 的 splitChunks 配置进行合并（cacheGroups 配置也会合并）。比如:

```ts [config/config.ts]
import { createDependenciesRegExp } from 'umi/plugin-utils'

export default defineConfig({
  codeSplitting: {
    jsStrategy: 'granularChunks',
    jsStrategyOptions: {
      override: { // [!code focus]
        usedExports: true,
        minSize: 15000,  // [!code focus]
        cacheGroups: { // [!code focus]
          echarts: { // [!code focus]
            name: 'lib-echarts', // [!code focus]
            test: createDependenciesRegExp('echarts', 'zrender'), // [!code focus]
            priority: 100,
            reuseExistingChunk: true,
          }, // [!code focus]
        }, // [!code focus]
      },
    }
  }
})
```

## dedupe <Badge type="tip" text="Kmi" />
- 类型：`string[]`
- 默认值：`undefined`

强制 Kmi 从项目根目录解析指定的包，这可以用于移除重复包和减少包大小。

示例:
例如，假设你的项目中由三方依赖引入多个不同版本的 `axios`, 在这种情况下, 你可以使用 `dedupe` 配置项来移除重复的 `axios` 包，将所有 `axios` 都解析到 `/node_modules/axios`

```ts [config/config.ts]
export default defineConfig({
  dedupe: ['axios'] // [!code ++]
})
```

::: warning
注意，如果使用 `dedupe` 将一个包的不同 `major` 版本统一为同一个，可能导致一些包无法正常工作，因为它们可能依赖于特定版本的 API 或功能。
:::

**实现原理**

是基于 [alias](#alias) 实现的，它会在当前项目的根目录下通过 `require.resolve` 获取指定包的路径，并设置到 `alias`中。

在上述的例子中，`dedupe` 会被转换为以下 `alias` 配置：

```js
const alias = {
  axios: '/node_modules/axios',
};
```

## depsOnDemand

- **Type:** `{ exclude: string[] }`

用于禁用插件调用 `addOnDemandDeps` 进行按需安装依赖, 如果不希望他们在项目启动时检测安装, 可通过 `exclude` 禁用。通常用于 monorepo 项目把依赖写到工作区后、不希望子包在进行依赖安装

示例:

```ts [config/config.ts]
export default defineConfig({
  depsOnDemand: {
    // 禁用 m-ui 依赖自动安装
    exclude: ['@m-ui/react'], // [!code ++]
  }
})
```

## define

- 类型：`Record<string, string>`
- 默认值：`{ NODE_ENV: 'development' | 'production', KMI_ENV: string }`

设置代码中的可用变量。

:::tip
- 属性值会经过一次 `JSON.stringify` 转换、无需手动进行 JSON.stringify
- 默认会注入 `KMI_ENV`、`NODE_NEV`、 `/^KMI_APP_/` 无需重复赋值
:::

比如，

```ts [config/config.ts]
export default defineConfig({
  define: { // [!code ++]
    FOO: 'bar' // [!code ++]
  } // [!code ++]
})
```

然后代码里的 `console.log(hello, FOO)` 会被编译成 `console.log(hello, 'bar')`。

## devtool

- 类型：`string`
- 默认值：dev 时默认 `cheap-module-source-map`，build 时候默认无 sourcemap

设置 sourcemap 生成方式。

常见可选值有：

- `eval`，最快的类型，缺点是不支持低版本浏览器
- `source-map`，最慢但最全的类型

:::warning
如在生产开启请关注流水线是否配置 雷达 sourcemap 收集插件、如无配置需考虑对外暴露 sourcemap 是否合适会造成源码泄漏
:::

示例，

关闭 dev 阶段的 sourcemap 生成

```ts [config/config.ts]
export default defineConfig({
  devtool: false // [!code ++]
})
```

生产开启 sourcemap

```ts [config/config.prod.ts]
export default defineConfig({
  devtool: 'source-map' // [!code ++]
})
```

## esbuildMinifyIIFE
- 类型：`boolean`
- 默认值：`true`

修复 `esbuild 压缩器` 自动引入的全局变量导致的命名冲突问题。
当使用 esbuild 作为压缩器，该压缩器会自动注入全局变量作为 polyfill，这可能会引发 异步块全局变量冲突、 qiankun 子应用和主应用全局变量冲突 等问题，通过打开该选项或切换 [jsMinifier](#jsminifier) 压缩器可解决此问题。
更多信息详见 [vite#7948](https://github.com/vitejs/vite/pull/7948) 。

示例
```ts  [config/config.ts]
export default defineConfig({
  // 关闭 esbuildMinifyIIFE
  esbuildMinifyIIFE: false // [!code ++]
})
```

## extensions <Badge type="tip" text="Kmi" />

- 类型：`string[]`
- 默认值：`['.ts','.tsx','.js','.jsx','.mjs','.cjs','.json','.wasm']`

按照顺序解析模块，例如 `require('./index')`，会依次尝试解析 `./index.ts`、`./index.tsx`...

示例
优先解析 `.web.tsx` 支持一码多投

```ts  [config/config.ts]
export default defineConfig({
  extensions: ['.web.tsx','.web.ts','.web.js','.ts','.tsx',...] // [!code ++]
})
```

## externals

- 类型：`Record<string, string> | Function`
- 默认值：`{}`

设置哪些模块不打包，转而通过 `<script>` 或其他方式引入，通常需要搭配 [headScripts](/config/html-config#headscripts) 配置使用。

::: tip
- 不要轻易设置 `antd` 或者 `@m-ui/react` 的 externals，由于依赖较多，使用方式复杂，可能会遇到较多问题，并且一两句话很难解释清楚。
- 设置 `react` externals 时、开发环境请使用 `react.development.js` 产物, 并且安装 [react devtools](https://react.dev/learn/react-developer-tools) 否则会导致热更新失效
:::

示例，

```ts  [config/config.ts]
export default defineConfig({
  // external react
  externals: { react: 'React' }, // [!code ++]
  // 引入 cdn
  headScripts: ['https://som.com/react@18.3.1/umd/react.development.js'], // [!code ++]
})
```

## extraBabelIncludes

- 类型：`Array<string | RegExp>`
- 默认值：`[]`

为了避免二次编译，默认情况下，Kmi 只会编译当前目录下的 JavaScript 文件，以及所有目录下的 TypeScript 和 JSX 文件，不会编译 node_modules 下的 JavaScript 文件。可通过配置 `extraBabelIncludes` 指定需要 `Kmi` 额外进行编译的目录或模块, `extraBabelIncludes` 的用法在 `Rspack` 模式下和 Webpack 一致, 将作用于 `Swc` 编译

配置额外需要做 Babel(Swc) 编译的 NPM 包或目录， 支持传入字符串、正则表达式来匹配模块的路径。比如：

```ts [config/config.ts]
export default defineConfig({
  extraBabelIncludes: [
    // 支持绝对路径
    join(__dirname, '../../common'),
    // 支持 npm 包
    'react-monaco-editor',
    // 转译全部路径含有 @scope 的包
    /@scope/
  ],
});
```

## extraBabelPlugins

- 类型：`string[]`
- 默认值：`[]`

配置额外的 babel 插件。可传入插件地址或插件函数。

::: tip
rspack 模式下默认不生效、可通过 `rspack: { useBabel: true }` 启用, 开启 babel 配置将会使 rspack 构建变慢请谨慎开启
:::

## extraBabelPresets

- 类型：`string[]`
- 默认值：`[]`

配置额外的 babel 插件集。可传入插件集地址或插件集函数。

## extraPostCSSPlugins

- 类型：`PostCSSPlugin[]`
- 默认值：`[]`

配置额外的 postcss 插件。

示例

```ts [config/config.ts]
export default defineConfig({
  extraPostCSSPlugins: [
    require('postcss-plugin-a'),
    [
      require('postcss-plugin-b'),
      {
        // 自定义参数
      }
    ]
  ],
});
```

## extraSwcPlugins <Badge type="tip" text="Kmi" />

- 类型：`[string, Record<string, any>][]`
- 默认值：`[]`

配置额外的 SWC 的 Wasm 插件。

示例

```ts [config/config.ts]
export default defineConfig({
  extraSwcPlugins: [
    ['@swc/plugin-styled-components', {}] // [!code ++]
  ]
});
```

## filename <Badge type="tip" text="Kmi" />

- **类型**：

```ts
export type FilenameConfig = {
  /**
   * JavaScript 文件的命名规则
   * @default
   * - dev: '[name].js'
   * - prod: '[name].[contenthash:8].js'
   */
  js?: NonNullable<Configuration['output']>['filename']
  /**
   * 异步 JavaScript 文件的命名规则
   * @default
   * - dev: '[name].async.js'
   * - prod: '[name].[contenthash:8].async.js'
   */
  jsAsync?: NonNullable<Configuration['output']>['filename']
  /**
   * CSS 文件的命名规则
   * @default
   * - dev: '[name].css'
   * - prod: '[name].[contenthash:8].css'
   */
  css?: NonNullable<Configuration['output']>['cssFilename']
  /**
   * 异步 CSS 文件的命名规则
   * @default
   * - dev: '[name].async.css'
   * - prod: '[name].[contenthash:8].async.css'
   */
  cssAsync?: NonNullable<Configuration['output']>['cssFilename']
  /**
   * SVG 图片的命名规则
   * @default '[name].[contenthash:8].svg'
   */
  svg?: string
  /**
   * HTML 文件的命名规则
   * @default `[name].html`
   */
  html?: string
  /**
   * 字体文件的命名规则
   * @default '[name].[contenthash:8][ext]'
   */
  font?: string
  /**
   * 非 SVG 图片的命名规则
   * @default '[name].[contenthash:8][ext]'
   */
  image?: string
  /**
   * 媒体资源的命名规则，如视频等
   * @default '[name].[contenthash:8][ext]'
   */
  media?: string
  /**
   * 其他资源的命名规则，除了上述资源(图片、SVG、字体、HTML、WASM等)以外的文件
   * @default '[name].[contenthash:8][ext]'
   */
  assets?: string
}
```

设置构建产物的名称。在生产模式构建后，Kmi 会自动在文件名中间添加 hash 值，如果不需要添加，可以将 [hash](#hash) 设置为 `false` 来禁用该行为

示例

```ts [config/config.ts]
export default defineConfig({
  filename: {
    // 为图片资源设置 前缀, 这里仅是演示推荐使用 outputPath 来进行子目录设置
    image: 'some-path/[name].[contenthash:8].js',
  }
});
```

## forkTSChecker

- **类型**：`object`
- **默认值**：`null`

开启 `TypeScript` 的类型检查。 配置项可参考 [ts-checker-rspack-plugin Options](https://github.com/rspack-contrib/ts-checker-rspack-plugin?tab=readme-ov-file#options)

示例，

```ts [config/config.ts]
export default defineConfig({
  forkTSChecker: {} // [!code ++]
})
```

## hash

- **类型**：`boolean`
- **默认值**：`true`

开启 `hash` 模式，让 `build` 之后的产物包含 hash 后缀。通常用于增量发布和避免浏览器加载缓存。

启用后，产物通常是这样，

```sh
.
├── framework.43bd7dfe.js
├── index.html
├── kmi.0b7868cf.css
├── kmi.14366a1e.js
├── layouts__index.3dac234b.async.js
├── polyfill.0cfdb355.js
├── src__pages__about.b20112b7.async.js
├── src__pages__chart.16e116be.async.js
├── src__pages__index.8a43a787.async.js
└── static
    └── kmi.23695eb5.png
```

注意：HTML 文件始终没有 hash 后缀。

## history <Badge type="warning" text="仅在运行时路由生效" />

- **类型**：`{ type: 'browser' | 'hash' | 'memory' }`
- **默认值**：`{ type: 'browser' }`

设置路由 history 类型。

示例，

```ts [config/config.ts]
export default defineConfig({
  history: {
    type: 'hash' // [!code ++]
  }
})
```

## https

- 类型：`{ cert: string; key: string; hosts: string[]; http2?: boolean; outputPath?: string[]  }`
- 默认值：`{ hosts: ['127.0.0.1', 'localhost'] }`

开启 dev 的 https 模式。更多详见 [使用 HTTPS 进行本地开发](/guide/https#mkcert)

关于参数。

- `cert` 和 `key` 分别用于指定 cert 和 key 文件。
- `hosts` 用于指定要支持 https 访问的 host，默认是 `['127.0.0.1', 'localhost']`。
- `http2` 用于指定是否使用 HTTP 2.0 协议，默认是 true（使用 HTTP 2.0 在 Chrome 或 Edge 浏览器中中有偶然出现 `ERR_HTTP2_PROTOCOL_ERRO`报错，如有遇到，建议配置为 false）。
- `outputPath` 自动创建一个自签名的证书时证书的存放位置, 默认会在 `@kmi/bundler-shared` 的 `dist` 产物目录下

示例，

```ts [config/config.ts]
export default defineConfig({
  // 启用
  https: {} // [!code ++]
})
```

## ignoreMomentLocale

- 类型：`boolean`
- 默认值：`true`

忽略 moment 的 locale 文件，用于减少产物尺寸。

注意：此功能默认开。配置 `ignoreMomentLocale: false` 关闭。

## ignoreRouteLayout

- 类型：`boolean`
- 默认值：`false`

忽略约定式路由布局生成, 默认为 `false`

示例：

```ts [config/config.ts]
export default defineConfig({
  ignoreRouteLayout: 'true' // [!code ++]
})
```

## inlineLimit <Badge type="tip" text="Kmi" />

- 类型：`number | InlineLimitConfig`

```ts

export type InlineLimitConfig = {
  /**
   * SVG 图片的 data URI 限制大小
   * @default 4096
   */
  svg?: number
  /**
   * 字体文件的 data URI 限制大小
   * @default 4096
   */
  font?: number
  /**
   * 非 SVG 图片的 data URI 限制大小
   * @default 4096
   */
  image?: number
  /**
   * 媒体资源(如视频)的 data URI 限制大小
   * @default 4096
   */
  media?: number
  /**
   * 其他静态资源的 data URI 限制大小
   * @default 4096
   */
  assets?: number
}
```

- 默认值：`4096`

```ts
const defaultInlineLimit = {
  svg: 4096,
  font: 4096,
  image: 4096,
  media: 4096,
  assets: 4096,
};
```

设置图片、字体、媒体等静态资源被自动内联为 base64 的体积阈值。默认情况下，体积小于 4KiB 的图片、字体、媒体等文件，会自动经过 Base64 编码，内联到页面中，不再会发送独立的 HTTP 请求。

示例
- 内联小于 10KiB 的所有静态资源

```ts [config/config.ts]
export default defineConfig({
  inlineLimit: 10 * 1024, // [!code ++]
})
```

- 禁用静态资源内联

```ts [config/config.ts]
export default defineConfig({
  inlineLimit: 0, // [!code ++]
})
```

- 内联所有静态资源

```ts [config/config.ts]
export default defineConfig({
  inlineLimit: Number.MAX_SAFE_INTEGER, // [!code ++]
})
```

- 设置图片资源的阈值为 5KiB，不内联视频资源

```ts [config/config.ts]
export default defineConfig({
  inlineLimit: {
    image: 5 * 1024, // [!code ++]
    media: 0, // [!code ++]
  }
})
```

## javascriptExportsPresence <Badge type="tip" text="Kmi" />
- **类型**：`boolean`
- **默认值** 默认是 `true`

当使用了不存在的导出或存在冲突的重导出时，进行报错。默认开启报错, 设置为 `false` 禁用, 更多详见 [编译时报错 was not found](/guide/rspack#编译时报错-export-foo-imported-as-foo-was-not-found-in-utils)

```ts [config/config.ts]
export default defineConfig({
  // 禁用不存在的的导出、不进行报错
  javascriptExportsPresence: false, // [!code ++]
});
```

## jsMinifier

- **类型**：`esbuild | terser | swc | none`
- **默认值** 默认是 `esbuild`

配置构建时压缩 JavaScript 的工具；`none`表示不压缩。

示例：

```ts [config/config.ts]
export default defineConfig({
  jsMinifier: 'terser' // [!code ++]
})
```

## jsMinifierOptions

- 类型：`object`
- 默认值：`{}`

`jsMinifier` 的配置项；默认情况下压缩代码会移除代码中的注释，可以通过对应的 `jsMinifier` 选项来保留注释。
更多选项查看
- [rspack swc](https://rspack.dev/zh/plugins/rspack/swc-js-minimizer-rspack-plugin)
- [esbuild](https://esbuild.github.io/api/#minify)
- [terser](https://github.com/webpack-contrib/terser-webpack-plugin?tab=readme-ov-file#terseroptions)

示例：
```ts [config/config.ts]
export default defineConfig({
  jsMinifier: 'esbuild',
  jsMinifierOptions: {
    minifyWhitespace: true, // [!code ++]
    minifyIdentifiers: true, // [!code ++]
    minifySyntax: true, // [!code ++]
  }
})
```

## mock

- **Type:** `{ exclude: string[] }`
- **Default:** `{}`

配置 mock 功能。

关于参数。exclude 用于排除不需要的 mock 文件；include 用于额外添加 mock 目录之外的 mock 文件。

示例:

```ts [config/config.ts]
export default defineConfig({
  // 让所有 pages 下的 _mock.ts 文件成为 mock 文件
  mock: {
    include: ['src/pages/**/_mock.ts'], // [!code ++]
  }
})
```

## monorepoRedirect

- **类型**：`{ srcDir?: string[], exclude?: RegExp[], peerDeps?: boolean }`
- **默认值**：`false`

在 monorepo 中使用 Kmi 时，你可能需要引入其他子包的组件、工具方法等，通过开启此选项来重定向这些子包的导入到他们的源码位置（默认为 `src` 文件夹）。

这种重定向的好处是：支持热更新，无需预构建其他子包即可进行开发。

通过配置 `srcDir` 来调整识别源码文件夹的优先位置，通过 `exclude` 来设定不需要重定向的依赖范围。

示例：

```ts [config/config.ts]
export default defineConfig({
  // 默认重定向到子包的 src 文件夹
  monorepoRedirect: {} // [!code ++]
  // 在子包中寻找，优先定向到 libs 文件夹
  monorepoRedirect: {
    srcDir: ['libs', 'src'],
  }
  // 不重定向 @scope/* 的子包
  monorepoRedirect: {
    exclude: [/^@scope\/.+/],
  }
})
```

在实际的大型业务 monorepo 中，每个子包的依赖都是从他们的目录开始向上寻找 `node_modules` 并加载的，但在本地开发时，依赖都安装在 `devDependencies` ，和从 npm 上安装表现不一致，所以不可避免会遇到多实例问题。

:::info
举个例子，每个子包在本地开发时都需要 `antd` ，在 `devDependencies` 中安装了，也在 `peerDependencies` 中指明了 `antd` ，我们预期该包发布到 npm ，被某个项目安装后， `antd` 是使用的项目本身的依赖，全局唯一，但由于在 monorepo 中，指定在 `devDependencies` 中的依赖必定存在，且子包代码寻找依赖时是从该子包进行的，导致了每个子包都用了自己的 `antd` ，出现了产物中有多份 `antd` 、产物体积增大、消息队列被破坏等情况。
:::

为了解决这种问题，我们约定：

当打开 `peerDeps` 选项时，所有子包指明的 `peerDependencies` 都会被自动添加 `alias` 重定向唯一化，避免多实例的存在：

```ts [config/config.ts]
export default defineConfig({
  monorepoRedirect: { peerDeps: true } // [!code ++]
})
```

经过重定向，依赖全局唯一，便可以在开发时保持和在 npm 上安装包后的体验一致。

## outputPath

- 类型：`string | OutputPathConfig`

```ts
export type OutputPathConfig = {
  /**
   * 所有文件的根目录
   * @default 'dist'
   **/
  root?: string
  /**
   * JavaScript 文件的输出目录
   * @default 'js'
   */
  js?: string
  /**
   * CSS 文件的输出目录
   * @default 'css'
   */
  css?: string
  /**
   * SVG 图片的输出目录
   * @default 'static/svg'
   */
  svg?: string
  /**
   * 字体文件的输出目录
   * @default 'static/font'
   */
  font?: string
  /**
   * Wasm 文件的输出目录
   * @default 'static/wasm'
   */
  wasm?: string
  /**
   * 非 SVG 图片的输出目录
   * @default 'static/image'
   */
  image?: string
  /**
   * 媒体资源的输出目录，如视频等
   * @default 'static/media'
   */
  media?: string
  /**
   * 除了上述资源(图片、SVG、字体、HTML、WASM等)以外的资源输出目录
   * @default 'static/assets'
   */
  assets?: string
}
```

- 默认值：`dist`

配置输出路径。

注意：不允许设定为 src、public、pages、mock、config、locales、models 等约定式功能相关的目录。

示例

```ts [config/config.ts]
export default defineConfig({
  outputPath: 'build' // [!code ++]
})
```

### outputPath 是对象 <Badge type="tip" text="Kmi" />

设置构建产物的输出目录，Kmi 会根据产物的类型将其输出到相应的子目录中。

- `root` 所有文件的根目录
`root` 是构建产物的根目录，可以为相对路径或绝对路径。如果 `root` 的值为相对路径，则会基于当前项目的根目录拼接为绝对路径。
其他目录只能为相对路径，并且会相对于 `root` 进行输出。

- `js` JavaScript 文件的输出目录
- `css` CSS 文件的输出目录
- `svg` SVG 图片的输出目录
- `font` 字体文件的输出目录
- `wasm` Wasm 文件的输出目录
- `image` 非 SVG 图片的输出目录
- `media` 媒体资源的输出目录，如视频等
- `assets` 除了上述资源(图片、SVG、字体、HTML、WASM等)以外的资源输出目录

示例
- 启用产物分组

```ts [config/config.ts]
export default defineConfig({
  outputPath: {} // [!code ++]
})
```
以上配置会生成如下的目录结构：

```sh
dist
├── js
│  └── kmi.[hash].js
├── css
├── static
│  ├── image
│  ├── font
│  └── ...
└── index.html
```

- 指定配置某个产物目录
```ts [config/config.ts]
export default defineConfig({
  outputPath: {
    image: 'static/img'
  }
})
```

以上配置会生成如下的目录结构：

```sh
dist
├── static
│  ├── image # [!code --]
│  ├── img   # [!code ++]
│  ├── font
│  └── ...
└── index.html
```

## plugins

- **Type:** `string[]`
- **Default:** `[]`

配置额外的 Umi 插件。

数组项为指向插件的路径，可以是 npm 依赖、相对路径或绝对路径。如果是相对路径，则会从项目根目录开始找。

示例:

```ts [config/config.ts]
export default defineConfig({
  plugins: [
    // npm 依赖
    'umi-plugin-hello', // [!code ++]
    // 相对路径
    './plugin', // [!code ++]
    // 绝对路径
    `${__dirname}/plugin.js`, // [!code ++]
  ]
})
```

## polyfill

- 类型：`{ imports: string[] }`
- 默认值：`{}`

设置按需引入的 `polyfill`。默认是根据传入的`浏览器兼容按需引入`。

比如只引入 core-js 的 stable 部分，

```ts [config/config.ts]
export default defineConfig({
  polyfill: {
    imports: ['core-js/stable']
  }
})
```

如果对于性能有更极致的要求，可以考虑按需引入，

```ts [config/config.ts]
export default defineConfig({
  polyfill: {
    imports: ['core-js/features/promise/try', 'core-js/proposals/math-extensions']
  }
})
```

注意：此功能默认开。配置 `polyfill: false` 或设置环境变量 `BABEL_POLYFILL=none` 关闭。

## presets

- **Type:** `string[]`
- **Default:** `[]`

配置额外的 Umi 插件集。

数组项为指向插件集的路径，可以是 npm 依赖、相对路径或绝对路径。如果是相对路径，则会从项目根目录开始找。

示例:

```ts [config/config.ts]
export default defineConfig({
  presets: [
    // npm 依赖
    'umi-preset-hello', // [!code ++]
    // 相对路径
    './preset', // [!code ++]
    // 绝对路径
    `${__dirname}/preset.js`, // [!code ++]
  ],
})
```

## proxy

- 类型：`object`
- 默认值：`{}`

配置代理功能。更多详见 [网络代理](https://umijs.org/docs/guides/proxy)

比如，

```ts [config/config.ts]
export default defineConfig({
  proxy: {
    '/api': {
      'target': 'http://jsonplaceholder.typicode.com/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    }
  }
})
```

然后访问 `/api/users` 就能访问到 http://jsonplaceholder.typicode.com/users 的数据。

注意：proxy 功能仅在 dev 时有效。

## publicPath

- 类型：`string`
- 默认值：`/`

配置 Webpack(Rspack) 的 publicPath。

示例:

```ts [config/config.ts]
export default defineConfig({
  publicPath: 'https://some.com/path/' // [!code ++]
})
```

## runtimePublicPath

- 类型：`object`
- 默认值：`null`

启用运行时 publicPath，开启后会使用 `window.publicPath` 作为资源动态加载的起始路径。

比如，

```ts [config/config.ts]
export default defineConfig({
  runtimePublicPath: {}
})
```

## removeConsole <Badge type="tip" text="Kmi" />
- **类型**：`boolean | ConsoleType[]`
- **默认值**：`false`

在生产模式构建时，是否自动移除代码中的 console.[methodName]。

### 全部移除

当 `removeConsole` 被设置为 true 时，会移除所有类型的 console.[methodName]：

示例:

```ts [config/config.ts]
export default defineConfig({
  removeConsole: true // [!code ++]
})
```

### 指定类型
你也可以指定仅移除特定类型的 console.[methodName]，比如移除 console.log 和 console.warn：

```ts [config/config.ts]
export default defineConfig({
  removeConsole: ['log', 'warn'] // [!code ++]
})
```
目前支持配置以下类型的 console：

```ts
type ConsoleType = 'log' | 'info' | 'warn' | 'error';
```

## rspack <Badge type="tip" text="Kmi" />
- **Type:** `{useBabel?: boolean; enableLessWoker?:boolean; lazyCompilation?:object;incremental?:boolean;}`
- **Default:** `{useBabel: false, enableLessWoker: true, lazyCompilation: false, javascriptExportsPresence: true,incremental: false}`

启用 [Rspack](https://rspack.dev/zh/index) 来进行应用打包, 提升构建速度, 更多详见 [使用 rspack](/guide/rspack)

示例:
```ts [config/config.ts]
export default defineConfig({
  rspack: {} // [!code ++]
})
```

### rspack.useBabel
默认情况下 Rspack 使用 `Swc` 进行编译、当内置的功能无法满足诉求、需要添加一些 Babel presets 或 plugins 进行额外处理时, Kmi 中可以通过 `rspack.useBabel` 启用对 babel 支持、这里需要注意的是

::: warning
开启 babel 插件会影响性能哦, 请谨慎使用
:::

示例:
```ts [config/config.ts]
export default defineConfig({
  rspack: {
    useBabel: true // [!code ++]
  },
  // 添加自定义 babel 插件
  extraBabelPlugins: [
    'babel-plugin-dynamic-import-node' // [!code ++]
  ]
})
```

### rspack.enableLessWoker

默认启用 woker less 编译, 在 rspack 的支持中我们发现虽然通过 swc 解决了 js 的编译但是 less 的编译还是很慢, 我们使用了 piscina 的 workers 并行编译 less 文件, 这可以加速编译过程。但是受限于 workers less 不在支持直接传函数、如需需要可通过一下配置切换到默认 less 支持

禁用 less worker
```ts [config/config.ts]
export default defineConfig({
  rspack: {
    enableLessWoker: false // [!code ++]
  },
})
```
lessWoker 使用 less 插件

```ts [config/config.ts]
export default defineConfig({
  rspack: {},
  lessLoader: {
    plugins: [
      [require.resolve("less-plugin-clean-css"), { roundingPrecision: 1 }] // [!code ++]
    ],
  },
});
```
## rspackBuildCache
- **类型**：`boolean`
- **默认值**：`false`

用于启用 `Rspack` 持久化构建缓存, 当启用时，Rspack 会在缓存目录中存储构建快照。在后续的构建中，如果命中缓存，Rspack 可以重用缓存的结果，而不是从头开始重新构建，这可以显著减少构建时间。

::: warning 📢 注意
Rspack 的持久化缓存处于 **实验性阶段**, 基于稳定性考虑, 流水线中就算开启 `rspackBuildCache` 以会强制禁用缓存
:::

示例: 仅在开发模式下启用缓存

```ts [config/config.ts]
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  rspackBuildCache: isDev
});
```

## svgr

- 类型：`object`
- 默认值：`{}`

svgr 默认开启，支持如下方式使用 React svg 组件：

```ts
import SmileUrl, { ReactComponent as SvgSmile } from './smile.svg';
```

可配置 svgr 的行为，配置项详见 [@svgr/core > Config](https://github.com/gregberge/svgr/blob/main/packages/core/src/config.ts#L9)。

## svgo

- 类型：`object`
- 默认值：`{}`

默认使用 svgo 来优化 svg 资源，配置项详见 [svgo](https://github.com/svg/svgo#configuration) 。

## swc <Badge type="tip" text="Kmi" />

- 类型：`Object | Function`
- 默认值：

::: details 点我查看默认值

```ts
jsc: {
  externalHelpers: true,
  parser: {
    tsx: false,
    syntax: 'typescript',
    decorators: true,
  },
  // Avoid the webpack magic comment to be removed
  // https://github.com/swc-project/swc/issues/6403
  preserveAllComments: true,
  experimental: {
    cacheRoot: opts.cacheRoot,
    plugins: [
      [require.resolve('@ksuni/swc-plugin-auto-css-modules'), {}],
      ...opts.extraSwcPlugins,
      ...(opts.userConfig.extraSwcPlugins || []).filter(Boolean),
    ],
  },
  transform: {
    legacyDecorator: true,
    decoratorMetadata: true,
    // see: https://github.com/swc-project/swc/issues/6571
    useDefineForClassFields: true,
  },
},
isModule: 'unknown',
env: {
  targets: opts.targets,
},
```

:::

通过 `swc` 可以设置 [builtin:swc-loader](https://rspack.dev/guide/features/builtin-swc-loader) 的选项, 通过 [配置 swc](/guide/config-swc) 了解更多

## targets

- 类型：`object`
- 默认值：`{ chrome: 80, safari: 11, firefox: 78, edge: 88 }`

配置需要兼容的浏览器最低版本。Kmi 会根据这个自定引入 polyfill、配置 autoprefixer 和做语法转换等。

示例，

```ts [config/config.ts]
export default defineConfig({
  targets: {
    // 兼容 ie 11
    ie: 11, // [!code ++]
  }
})
```

## theme

- 类型：`object`
- 默认值：`{}`

配置 `less` 变量主题。

示例，

```ts [config/config.ts]
export default defineConfig({
  theme: {
    '@primary-color': '#3666fd',
    '@layout-header-height': '48px',
  }
})
```

## transformImport <Badge type="tip" text="^1.6.2" />
- **Type:**

```ts
type TransformImport = Array<{
  libraryName: string;
  libraryDirectory?: string;
  style?: string | boolean;
  styleLibraryDirectory?: string;
  camelToDashComponentName?: boolean;
  transformToDefaultImport?: boolean;
  customName?: string;
  customStyleName?: string;
}>;
```
- **Default:** `{}`

转换 import 的路径，可以用于模块化引用三方包的子路径，能力类似于 [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)。

示例

- 按需引入 antd 组件

在使用 antd 组件库时（低于 v5 版本），你可以通过以下配置来按需引入组件：

```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'antd',  // [!code ++]
      libraryDirectory: 'es',  // [!code ++]
      style: 'css',  // [!code ++]
    },
  ],
});
```
源代码如下：
```ts
import { Button } from 'antd';
```

会被转换成：

```ts
import Button from 'antd/es/button';
import 'antd/es/button/style';
```

- 按需引入 lodash
在使用 lodash 时，你可以通过 `transformImport` 来自动引用子路径，减小包体积。

```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'lodash',  // [!code ++]
      customName: 'lodash/{{ member }}',  // [!code ++]
    },
  ],
});
```

源代码如下：

```ts
import { get } from 'lodash';
```
会被转换成：

```ts
import get from 'lodash/get';
```

请避免以下用法，否则会引入所有的 lodash 代码：

```ts
import _ from 'lodash';
import lodash from 'lodash';
```
### transformImport 适用范围
`transformImport` 只适用于经过 Kmi Rspack 编译的模块。需要注意的是，Kmi 默认并不会编译位于 node_modules 目录下的 JavaScript 文件。这意味着，node_modules 目录内的代码将不会被 `transformImport` 处理。
如果你希望通过 `transformImport` 对 node_modules 下的代码进行处理，请将相关模块添加到 配 [extraBabelIncludes](#extrababelincludes) 配置中。

### transformImport.libraryName
- **Type:**  `string`

用于指定需要按需加载的模块名称。当 Kmi 遍历代码时，如果遇到了对应模块的 import 语句，则会对其进行转换。

### transformImport.libraryDirectory
- **Type:**  `string`
- **Default:** `'lib'`
用于拼接转换后的路径，拼接规则为 `${libraryName}/${libraryDirectory}/${member}`，其中 member 为引入成员。

示例：
```ts
import { Button } from 'foo';
```

转换结果

```ts
import Button from 'foo/lib/button';
```

### transformImport.style
- **Type:**  `string`
- **Default:** `'undefined'`

确定是否需要引入相关样式，若为 `true`，则会引入路径 `${libraryName}/${libraryDirectory}/${member}/style`。若为 `false` 或 `undefined` 则不会引入样式。
当配置为 `true` 时：

```ts
import { Button } from 'foo';
```

转换结果

```ts
import Button from 'foo/lib/button';
import 'foo/lib/button/style';
```

### transformImport.styleLibraryDirectory

- **Type:**  `string`
- **Default:** `'undefined'`

用于拼接引入样式时的引入路径，若该配置被指定，则 `style` 配置项会被忽略。拼接引入路径为 `${libraryName}/${styleLibraryDirectory}/${member}`。
当配置为 `styles` 时：

```ts
import { Button } from 'foo';
```

转换结果:

```ts
import Button from 'foo/lib/button';
import 'foo/styles/button';
```

###  transformImport.camelToDashComponentName

- **Type:**  `boolean`
- **Default:** `'true'`

是否需要将 camelCase 的引入转换成 kebab-case。
示例:

```ts
import { ButtonGroup } from 'foo';
```

转换结果:

```ts
// 设置成 true：
import ButtonGroup from 'foo/button-group';
// 设置成 false：
import ButtonGroup from 'foo/ButtonGroup';
```

###  transformImport.transformToDefaultImport

- **Type:**  `boolean`
- **Default:** `'true'`

是否将导入语句转换成默认导入。

示例:

```ts
import { Button } from 'foo';
```

转换结果:

```ts
// 设置成 true：
import Button from 'foo/button';
// 设置成 false：
import { Button } from 'foo/button';
```

###  transformImport.customName

- **Type:**  `string`
- **Default:** `'undefind'`

自定义转换后的导入路径。
比如下面的配置，会将 `import { foo } from 'my-lib'` 转换为 `import foo from 'my-lib/foo'`。

```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'my-lib',
      customName: `my-lib/{{ member }}`, // [!code ++]
    },
  ]
})
```
此外, 你还可以声明转换后的路径格式，例如设置为 `camelCase member`, 来将 member 转换成驼峰格式。
- `kebabCase`：字母小写，单词之间使用连字符连接。例如：`my-variable-name`。
- `snakeCase`：字母小写，单词之间使用下划线连接。例如：`my_variable_name`。
- `camelCase`：首字母小写，随后每个单词的首字母大写。例如：`myVariableName`。
- `upperCase`：字母大写，其他字符不变。例如：`MY-VARIABLE-NAME`。
- `lowerCase`：字母小写，其他字符不变。例如：`my-variable-name`。

比如
```ts [config/config.ts]
export default defineConfig({
  transformImport: [
    {
      libraryName: 'my-lib',
      customName: `my-lib/{{ camelCase member }}`, // [!code ++]
    },
  ]
})
```
