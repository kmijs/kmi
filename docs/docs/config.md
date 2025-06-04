# 配置

自定义配置，你可以使用项目根目录的 `.umirc.ts` 文件或者 `config/config.ts`，值得注意的是这两个文件功能一致，仅仅是存在目录不同，2 选 1，`.umirc.ts` 文件优先级较高。

> 更多目录相关信息介绍，你可以在目录结构了解。

Umi 的配置文件是一个正常的 node 模块，它在执行 Umi 命令行的时候使用，并且不包含在浏览器端构建中。

这里有一个最简单的 Umi 配置文件的范例：

```ts
import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: 'dist',
});
```

使用 `defineConfig` 包裹配置是为了在书写配置文件的时候，能得到更好的拼写联想支持。如果你不需要，直接 `export default {}` 也可以。

值得关注的是在你使用 Umi 的时候，你不需要了解每一个配置的作用。你可以大致的浏览一下以下 Umi 支持的所有配置，然后在你需要的时候，再回来查看如何启用和修改你需要的内容。

> 为方便查找，以下配置项通过字母排序。

## alias

* 类型：`Record<string, string>`
* 默认值：`{}`

配置别名，对 import 语句的 source 做映射。

比如：

```ts
{
  alias: {
    foo: '/tmp/to/foo',
  }
}
```

然后代码里 `import 'foo'` 实际上会 `import '/tmp/to/foo'`。

有几个 Tip。

1、alias 的值最好用绝对路径，尤其是指向依赖时，记得加 `require.resolve`，比如，

```ts
// ⛔
{
  alias: {
    foo: 'foo',
  }
}

// ✅
{
  alias: {
    foo: require.resolve('foo'),
  }
}
```

2、如果不需要子路径也被映射，记得加 `$` 后缀，比如

```ts
// import 'foo/bar' 会被映射到 import '/tmp/to/foo/bar'
{
  alias: {
    foo: '/tmp/to/foo',
  }
}

// import 'foo/bar' 还是 import 'foo/bar'，不会被修改
{
  alias: {
    foo$: '/tmp/to/foo',
  }
}
```

## analyze

* 类型：`object`
* 默认值：`{}`

通过指定 ANALYZE 环境变量分析产物构成时，analyzer 插件的具体配置项，见 webpack-bundle-analyzer。

示例：

```ts
analyze: {
  analyzerMode: 'server',
  analyzerPort: 8888,
  openAnalyzer: true,
}
```

## assetsInclude

* 类型：`Array<string | RegExp>`
* 默认值：`undefined`

包含应该被视为静态资源的额外文件。

比如：

```ts
assetsInclude: [
  '**/*.md',
  /\.data$/
]
```

## autoCSSModules

* 类型：`boolean`
* 默认值：`undefined`

是否启用自动 CSS Modules。启用后，文件名包含 `.module.` 的样式文件会被自动识别为 CSS Modules。

```ts
autoCSSModules: true
```

## autoprefixer

* 类型：`object`
* 默认值：`{}`

用于解析 CSS 并使用来自 Can I Use 的值将供应商前缀添加到 CSS 规则。如自动给 CSS 添加 `-webkit-` 前缀。

更多配置，请查阅 autoprefixer 的配置项。

## base

* 类型：`string`
* 默认值：`/`

要在非根目录下部署 Umi 项目时，你可以使用 base 配置。

base 配置允许你为应用程序设置路由前缀。比如有路由 `/` 和 `/users`，设置 base 为 `/foo/` 后就可通过 `/foo/` 和 `/foo/users` 访问到之前的路由。

> 注意：base 配置必须在构建时设置，并且不能在不重新构建的情况下更改，因为该值内联在客户端包中。

## bundler

* 类型：`BundlerConfig`
* 默认值：`{}`

自定义 bundler (Webpack/Rspack) 配置项。可以直接修改底层的构建工具配置。

```ts
bundler: {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      // 自定义规则
    ],
  },
}
```

## bundlerChain

* 类型：`(memo: Config, args: ModifyChainUtils) => void | Config | Promise<void | Config>`
* 默认值：`undefined`

通过 rspack-chain 自定义 bundler (Webpack/Rspack) 配置项。基于链式调用的方式修改配置。

```ts
bundlerChain: (memo, { env }) => {
  // 设置 alias
  memo.resolve.alias.set('foo', '/tmp/to/foo');

  // 添加额外插件
  memo.plugin('hello').use(Plugin, [...args]);

  // 删除内置插件
  memo.plugins.delete('hmr');

  return memo;
}
```

## chainWebpack

* 类型：`(config: Config, opts: ModifyWebpackOpts) => void`
* 默认值：`undefined`

为了扩展 kmi 内置的 webpack 配置，我们提供了用链式编程的方式修改 webpack 配置，基于 webpack-chain。

该函数具有两个参数：

* `config` 是现有 webpack 配置
* `opts` 包含一些额外信息和辅助对象，目前有 `env`、`webpack` 和 `rspack`。`env` 为当前环境，值为 `development` 或 `production`

用法示例：

```ts
chainWebpack: (config, { env, webpack }) => {
  // 设置 alias
  config.resolve.alias.set('foo', '/tmp/to/foo');

  // 添加额外插件
  config.plugin('hello').use(Plugin, [...args]);

  // 删除 umi 内置插件
  config.plugins.delete('hmr');
}
```

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

### codeSplitting.jsStrategyOptions.forceSplitting

- **类型**：`RegExp[] | Record<string, RegExp>`
- **默认值**：`[]`

通过 `codeSplitting.jsStrategyOptions.forceSplitting` 配置项可以将指定的模块强制拆分为一个独立的 chunk。

比如将 node_modules 下的 `@m-ui/react` 库拆分到 `m-ui.js` 中：

```ts [config/config.ts]
import { createDependenciesRegExp } from '@kmi/kmijs/plugin-utils'

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

相比直接配置 Rspack(Webpack) 的 splitChunks，这是一个更加简便的方式。

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

### codeSplitting.jsStrategyOptions.override
- **类型**：`SplitChunks`
- **默认值**：`{}`

可以通过 `codeSplitting.jsStrategyOptions.override` 配置项来自定义 Rspack(Webpack) 拆包配置, 此配置会和 Rspack(Webpack) 的 splitChunks 配置进行合并（cacheGroups 配置也会合并）。比如:

```ts [config/config.ts]
import { createDependenciesRegExp } from '@kmi/kmijs/plugin-utils'

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
## copy

* 类型：`ICopy[] | string[]`
* 默认值：`undefined`

配置需要复制到输出目录的文件或文件夹。

```ts
copy: [
  { from: 'public', to: 'dist' },
  'assets/**/*',
]
```

## cssExtractLoader

* 类型：`object`
* 默认值：`{}`

配置 CSS 提取加载器的选项。

## cssLoader

* 类型：`object`
* 默认值：`{}`

配置 css-loader 的选项。

## cssLoaderModules

* 类型：`object`
* 默认值：`{}`

配置 CSS Modules 模式下 css-loader 的选项。

## cssMinifier

* 类型：`'esbuild' | 'cssnano' | 'lightningcss'`
* 默认值：根据 bundler 而定

压缩 CSS 的工具。

## cssMinifierOptions

* 类型：`object`
* 默认值：`{}`

压缩 CSS 的工具配置。

## define

* 类型：`{ [key: string]: any }`
* 默认值：`{}`

定义全局变量，会在编译时被替换。

```ts
define: {
  __VERSION__: '1.0.0',
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}
```

## devtool

* 类型：`Config.DevTool`
* 默认值：根据环境而定

配置 webpack 的 devtool。

## emitAssets

* 类型：`boolean`
* 默认值：`true`

用于控制是否输出图片、字体、音频、视频等静态资源。

## esm

* 类型：`object`
* 默认值：`{}`

ESM 相关配置。

## esbuildMinifyIIFE

* 类型：`boolean`
* 默认值：`false`

是否启用 esbuild 的 IIFE 格式压缩。

## extensions

* 类型：`string[]`
* 默认值：`undefined`

按照顺序解析模块，例如 `require('./index')`，会依次尝试解析 `'./index.js'`、`'./index.json'`。

```ts
extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
```

## externals

* 类型：`WebpackConfig['externals']`
* 默认值：`undefined`

配置 webpack 的 externals。

## extraBabelIncludes

* 类型：`Array<string | RegExp>`
* 默认值：`[]`

配置额外需要 Babel 编译的文件。

```ts
extraBabelIncludes: [
  /node_modules\/some-package/,
  'src/lib/**/*',
]
```

## extraBabelPlugins

* 类型：`BabelPlugin[]`
* 默认值：`[]`

配置额外的 Babel 插件。

```ts
extraBabelPlugins: [
  ['babel-plugin-import', { libraryName: 'antd' }],
]
```

## extraBabelPresets

* 类型：`BabelPlugin[]`
* 默认值：`[]`

配置额外的 Babel 预设。

## extraPostCSSPlugins

* 类型：`any[]`
* 默认值：`[]`

配置额外的 PostCSS 插件。

## filename

* 类型：`FilenameConfig`
* 默认值：`{}`

设置构建产物的名称。在生产模式构建后，kmi 会自动在文件名中间添加 hash 值，如果不需要添加，可以将 hash 设置为 false 来禁用该行为。

```ts
filename: {
  js: '[name].[contenthash:8].js',
  css: '[name].[contenthash:8].css',
  image: '[name].[contenthash:8][ext]',
}
```

## forkTSChecker

* 类型：`object`
* 默认值：`{}`

fork-ts-checker-webpack-plugin 的配置。

## hash

* 类型：`boolean`
* 默认值：`true`（生产环境）

是否启用文件名 hash。

## https

* 类型：`HttpsServerOptions`
* 默认值：`undefined`

HTTPS 服务器配置。

## ignoreMomentLocale

* 类型：`boolean`
* 默认值：`false`

是否忽略 moment.js 的 locale 文件。

## inlineLimit

* 类型：`number | InlineLimitConfig`
* 默认值：`4096`

配置文件内联为 data URI 的限制大小。

```ts
inlineLimit: {
  svg: 4096,
  font: 4096,
  image: 4096,
  media: 0,
  assets: 4096,
}
```

## javascriptExportsPresence

* 类型：`boolean`
* 默认值：`false`

关闭不存在的导出或存在冲突的重导出时报错校验。

## jsMinifier

* 类型：`'esbuild' | 'terser' | 'swc' | 'uglifyJs'`
* 默认值：根据 bundler 而定

配置 JS 压缩工具。

## jsMinifierOptions

* 类型：`object`
* 默认值：`{}`

配置 JS 压缩工具的选项。

## lessLoader

* 类型：`object | ((loaderContext: LoaderContext) => object)`
* 默认值：`{}`

配置 less-loader。

```ts
lessLoader: {
  lessOptions: {
    modifyVars: {
      '@primary-color': '#1DA57A',
    },
  },
}
```

## lightningcssLoader

* 类型：`boolean | LightningcssLoaderOptions`
* 默认值：`false`

是否启用 Lightning CSS loader。

## manifest

* 类型：`Partial<ManifestOptions>`
* 默认值：`{}`

配置 manifest 插件。

## mdx

* 类型：`object`
* 默认值：`{}`

MDX 相关配置。

## modifyWebpackConfig

* 类型：`(config: Configuration, opts: ModifyWebpackOpts) => Configuration`
* 默认值：`undefined`

用户提供的配置修改器，可以直接修改 webpack 配置对象。

```ts
modifyWebpackConfig: (config, { env }) => {
  if (env === 'development') {
    config.devtool = 'cheap-module-source-map';
  }
  return config;
}
```

## normalCSSLoaderModules

* 类型：`object`
* 默认值：`{}`

配置非 CSS Modules 模式下 css-loader 的选项。

## outputPath

* 类型：`string | OutputPathConfig`
* 默认值：`'dist'`

配置输出路径。

```ts
// 字符串形式
outputPath: 'build'

// 对象形式
outputPath: {
  root: 'dist',
  js: 'static/js',
  css: 'static/css',
  image: 'static/images',
}
```

## postcssLoader

* 类型：`object`
* 默认值：`{}`

配置 postcss-loader 的选项。

## proxy

* 类型：`{ [key: string]: ProxyOptions } | ProxyOptions[]`
* 默认值：`{}`

配置代理，用于解决开发环境的跨域问题。

```ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

## publicPath

* 类型：`string`
* 默认值：`/`

配置 webpack 的 publicPath。

## rspack

* 类型：`object`
* 默认值：`{}`

用于启用 rspack 相关能力的配置，这里不是 rspack 配置本身。

```ts
rspack: {
  useBabel: false,
  enableLessWorker: true,
  lazyCompilation: true,
}
```

支持的选项：

- `useBabel`: 启用 babel 编译，默认是 false
- `enableLessWorker`: 启用 less worker 编译，默认是 true
- `lazyCompilation`: 启用懒编译

## runtimePublicPath

* 类型：`object | boolean`
* 默认值：`false`

启用运行时 publicPath，开启后会使用 `window.publicPath` 作为资源动态加载的起始路径。

```ts
runtimePublicPath: {}
```

## sassLoader

* 类型：`object`
* 默认值：`{}`

配置 sass-loader 的选项。

## server

* 类型：`object`
* 默认值：`{}`

开发服务器配置。

```ts
server: {
  open: true,
  host: '0.0.0.0',
  port: 8000,
}
```

## styleLoader

* 类型：`object`
* 默认值：`{}`

启用 style loader 功能，让 CSS 内联在 JS 中，不输出额外的 CSS 文件。

## stylusLoader

* 类型：`object`
* 默认值：`{}`

配置 stylus-loader 的选项。

## targets

* 类型：`{ [key: string]: any }`
* 默认值：`{}`

配置需要兼容的浏览器最低版本。kmi 会根据这个自动引入 polyfill、配置 autoprefixer 和做语法转换等。

示例：

```ts
// 兼容 ie11
targets: {
  ie: 11,
}

// 兼容现代浏览器
targets: {
  chrome: 80,
  firefox: 78,
  safari: 13,
}
```

## theme

* 类型：`object`
* 默认值：`{}`

配置 less 变量主题。

示例：

```ts
theme: {
  '@primary-color': '#1DA57A',
  '@link-color': '#1DA57A',
}
```

## writeToDisk

* 类型：`boolean`
* 默认值：`false`

开启后会在 dev 模式下额外输出一份文件到输出目录，通常用于 chrome 插件、electron 应用等开发场景。
