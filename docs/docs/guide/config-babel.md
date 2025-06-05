# 配置 Babel

::: warning
在 Rspack 模式中默认使用 Swc 进行编译、执行 Babel 转译，存在额外的编译开销，这可能导致构建速度明显降低
:::

Kmi 提供了三个配置项来自定义 Babel 的行为:
- `extraBabelIncludes`: 配置需要额外进行 Babel 编译的文件
- `extraBabelPlugins`: 配置额外的 Babel 插件
- `extraBabelPresets`: 配置额外的 Babel 预设

## 示例

### 配置额外需要做 Babel 编译的 npm 包或目录

``` ts [config/config.ts]
import { join } from 'path';

export default defineConfig({
  extraBabelIncludes: [
    // 支持绝对路径
    join(__dirname, '../../common'),
    // 支持 npm 包
    "react-monaco-editor",
  ],
});
```

### 配置额外的 Babel 插件

``` ts [config/config.ts]
export default defineConfig({
  extraBabelPlugins: [
    "babel-plugin-react-require",
    [
      //  这里仅是演示, 如需配置  babel-plugin-import, 请使用 transformImport
      "babel-plugin-import",
      {
        libraryName: "xxx-components",
        libraryDirectory: "es",
        style: true,
      },
    ],
  ],
});
```

::: tip
这里的 `babel-plugin-import` 仅是示例, 在 Kmi 中提供了更通用的 [transformImport](/config/config#transformimport) 配置
:::

### 配置额外的 Babel 插件集

```ts [config/config.ts]
export default defineConfig({
  extraBabelPresets: ['@babel/preset-flow'],
});
```

## 常见问题

### 编译卡死
在使用 Babel 插件后，如果编译进度条卡死，但终端无 Error 日志时，通常是因为编译过程中出现了异常。在某些情况下，当 Error 被 webpack 或其他模块捕获后，错误日志不会被正确输出。最为常见的场景是 Babel 配置出现异常，抛出 Error 后被 webpack 捕获，而 webpack 在个别情况下吞掉了 Error。

解决方法：

如果你修改 Babel 配置后出现此问题，建议检查是否有以下错误用法：

1. 配置了一个不存在的 `plugin` 或 `preset`，可能是名称拼写错误，或是未正确安装。

```ts [config/config.ts]
// 错误示例
export default defineConfig({
  extraBabelPlugins: [
    // 该插件名称错误，或者未安装
    'babel-plugin-not-exists', // [!code error]
  ],
});
```

2.  是否配置了多个 `babel-plugin-import`，但是没有在数组的第三项声明每一个 babel-plugin-import 的名称。

```ts [config/config.ts]
// 错误示例
export default defineConfig({
  extraBabelPlugins: [
    // 没有在数组的第三项声明每一个 babel-plugin-import 的名称
    [
      'babel-plugin-import',  // [!code error]
      { libraryName: 'antd', libraryDirectory: 'es' },  // [!code error]
    ],
    [
      'babel-plugin-import', // [!code error]
      { libraryName: 'antd-mobile', libraryDirectory: 'es' }, // [!code error]
    ],
  ],
});
```

✅ 正确示例
```ts [config/config.ts]
// 错误示例
export default defineConfig({
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      { libraryName: 'antd', libraryDirectory: 'es' },
      'antd', // [!code ++]
    ],
    [
      'babel-plugin-import',
      { libraryName: 'antd-mobile', libraryDirectory: 'es' },
      'antd-mobile', // [!code ++]
    ],
  ],
});
```

