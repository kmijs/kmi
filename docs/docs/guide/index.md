# 使用 Rspack

:::tip Rspack 介绍
[Rspack](https://rspack.dev/zh/index) 是一个基于 Rust 编写的高性能 JavaScript 打包工具， 它提供对 webpack 生态良好的兼容性，能够无缝替换 webpack， 并提供闪电般的构建速度。

相较于 webpack，Rspack 的构建性能有明显提升，除了 Rust 带来的语言优势，这也来自于它的并行架构和增量编译等特性。经过 benchmark 验证，Rspack 可以带来 5 ～ 10 倍编译性能的提升。
:::

**Kmi 提供开箱即用的 Rspack 支持**，你可以在成熟的 Webpack 和更快的 Rspack 之间进行切换。
这篇文档会向你介绍如何在 Kmi 中开启 Rspack 构建模式。

## 开启 Rspack 构建

从 Umi 的 `4.4.11` 版本起，在一个已有的 Umi 项目中，你仅需在 `config/config.ts` 中添加以下配置，即可启用 Rspack 构建：

```ts [config/config.ts]
import { defineConfig } from '@kmi/kmijs';

export default defineConfig({
  // Configure Kmi preset
  presets: ['@kmijs/preset-bundler'],
  // Enable Rspack
  rspack: {}
});
```

::: tip
如果你当前版本低于 `4.4.11`，可升级 `umi` 或者 `@umijs/max` 后在进行操作。
:::

## 注意事项

在使用 Rspack 前，你需要了解以下事项：

- Rspack 能够兼容大部分 webpack 插件和几乎所有的 loaders，但仍有少数 webpack 插件暂时无法使用，详见 [Plugin 兼容](https://rspack.dev/zh/guide/compatibility/plugin)。
- Rspack 默认基于 SWC 进行代码编译和压缩， 如项目使用了 额外的 babel 插件, 请联系 Kmi oncall 就行沟通处理。

## 配置迁移
在 Umi 中可以像 Webpack 一样使用 [chainWebpack](/config/shared-config#chainwebpack) 进行配置的自定义, 所以通常情况下 你不需要额外做什么, 就可以完成配置的平移

## Faq

### Babel 插件替代

#### babel-plugin-import
在 Kmi 中可以通过配置 `transformImport`  转换 import 的路径，可以用于模块化引用三方包的子路径，能力类似于 [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import)。 更多详见 [transformImport](/config/shared-config#transformimport)

- 类型
```ts
type TransformImport =
  | Array<{
      libraryName: string;
      libraryDirectory?: string;
      style?: string | boolean;
      styleLibraryDirectory?: string;
      camelToDashComponentName?: boolean;
      transformToDefaultImport?: boolean;
      customName?: string;
      customStyleName?: string;
    }>
```
使用

```ts [config/config.ts] {2-8}
export default defineConfig({
  transformImport: [
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    },
  ],
});
```


#### 其他 babel 插件
Kmi 中可以通过 `rspack.useBabel` 启用对别的 babel 支持、这里需要注意的是 开启 babel 后会影响构建性能 请谨慎使用
开启 babel 插件会影响性能哦

```ts [config/config.ts]
export default defineConfig({
   rspack: {
      useBabel: true, // [!code ++]
   }
});
```

###  编译时报错 export 'foo' (imported as 'foo') was not found in './utils'？

如果编译的过程中出现此报错，说明代码中引用了一个不存在的导出。
比如以下例子，`index.ts` 中引用了 `utils.ts` 中的 `foo` 变量， 但 `utils.ts` 实际上只导出了 `bar` 变量。

```ts
// utils.ts
export const bar = 'bar';

// index.ts
import { foo } from './utils';
```

在这种情况下，Kmi 会抛出以下错误：
```sh
Compile Error:
File: ./src/index.ts
export 'foo' (imported as 'foo') was not found in './utils' (possible exports: bar)
```
当你遇到该问题时，首先需要检查相关代码里 import / export 的内容是否正确，并修正相关错误。
常见的错误写法有：

- 引入了不存在的变量：
```ts
// utils.ts
export const bar = 'bar';

// index.ts
import { foo } from './utils';
```

- re-export 了一个类型，但是没有添加 `type` 修饰符，导致 SWC、Babel 等转译工具无法识别到类型导出，导致编译异常。
```ts
// utils.ts
export type Foo = 'bar';

// index.ts
export { Foo } from './utils'; // 错误写法
export type { Foo } from './utils'; // 正确写法
```

在个别情况下，以上报错是由第三方依赖引入的，你无法直接修改它。此时，如果你确定该问题不影响你的应用，那么可以添加以下配置，将 `error` 日志修改为 `warn` 级别：

```ts [config/config.ts]
export default defineConfig({
  // 禁用不存在的的导出、不进行报错
  javascriptExportsPresence: false, // [!code ++]
});
```

同时，你需要尽快联系第三方依赖的开发者来修复相应的问题。
你可以查看 Rspack 的文档来了解 [module.parser.javascript.exportsPresence](https://rspack.dev/zh/config/module#moduleparserjavascriptexportspresence) 的更多细节。

### Less 配置不支持
less-loader 配置、不支持函数配置。在新版本的 rspack 支持中 less 编译我们使用了 `piscina` 的 workers 并行编译 less 文件, 这可以加速编译过程。但是受限于 workers less 不在支持直接传函数、如需需要可通过一下配置切换到默认 less 支持
默认配置如下
```ts
export interface LessLoaderOpts {
  modifyVars?: Record<string, string>;
  globalVars?: Record<string, string>;
  math?:
    | 'always'
    | 'strict'
    | 'parens-division'
    | 'parens'
    | 'strict-legacy'
    | number
    | undefined;
  // Enables/Disables generation of source maps. https://github.com/webpack-contrib/less-loader#sourcemap
  sourceMap?: boolean;
  /**
   * A plugin can be a file path string, or a file path string with a params object.
   * Notice! The file path should be a resolved path like require.resolve("less-plugin-clean-css"),
   * and the params object must be a plain json. We will require the plugin file to get the plugin content.
   * If the params object been accepted, that means, the required content will be treated as a factory class of Less.Plugin,
   * we will create a plugin instance with the params object, or else, the required content will be treated as a plugin instance.
   * We do this because the less loader runs in a worker pool for speed, and a less plugin instance can't be passed to worker directly.
   */
  plugins?: (string | [string, Record<string, any>])[];
}
```

禁用 lessWoker

```ts [config/config.ts]
export default defineConfig({
  rspack: {
    // 禁用 less worker
    enableLessWoker: false, // [!code ++]
  },
});
```

#### Less 插件配置
```ts [config/config.ts]
export default defineConfig({
  lessLoader: {
    math: 'always',
    plugins: [
      [require.resolve("less-plugin-clean-css"), { roundingPrecision: 1 }]
    ],
  },
});
```
