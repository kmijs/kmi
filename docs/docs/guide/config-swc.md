# 配置 Swc

[SWC](https://github.com/swc-project/swc)（Speedy Web Compiler）是基于 Rust 语言编写的高性能 JavaScript 和 TypeScript 转译和压缩工具。SWC 提供与 Babel 和 Terser 相似的能力，在单线程上它比 Babel 快 20 倍，在四核上它比 Babel 快 70 倍。

Kmi 在 Rspack 模式下 启用 SWC 的以下功能：

- 通过 Rspack 的 [builtin:swc-loader](https://rspack.dev/guide/features/builtin-swc-loader) 来转换 JavaScript 和 TypeScript 代码，它是 [swc-loader](https://github.com/swc-project/pkgs/tree/main/packages/swc-loader) 的 Rust 版本。

## 通过配置修改

### 自定义 Loader 选项

`builtin:swc-loader` 的选项与 JS 版本的 `swc-loader` Kmi 提供了 [swc](/config/config#swc) 选项来配置 `builtin:swc-loader`，比如：

```ts [config/config.ts]
export default defineConfig({
  // 📢📢 这里仅是演示, 一般默认行为即可
  swc: {
    jsc: {
      transform: {
        react: {
          pragma: 'React.createElement',
          pragmaFrag: 'React.Fragment',
          throwIfNamespace: true,
          development: false,
          useBuiltins: false,
        },
      },
    },
  }
});
```

### 配置 SWC 插件

Kmi 中可以通过 [extraSwcPlugins](/config/config#extraswcplugins) 配置来注册 Swc 的 Wasm 插件, 比如注册 [@swc/plugin-styled-components](https://www.npmjs.com/package/@swc/plugin-styled-components)


```ts [config/config.ts]
export default defineConfig({
  extraSwcPlugins: [
    ['@swc/plugin-styled-components', {}] // [!code ++]
  ]
});
```

::: tip
你可以通过 [awesome-swc](https://github.com/swc-contrib/awesome-swc) 仓库查看社区中可用的 SWC 插件
:::

## 通过插件修改

在 Kmi 中提供了 [modifySwcLoaderOptions](/api#modifySwcLoaderOptions) 和 [addExtraSwcPlugins](/api#addExtraSwcPlugins) 来提供 `builtin:swc-loader` 的自定义能力

比如 新增一个 swc 插件

```ts
api.addExtraSwcPlugins(() => {
  return [
    [require.resolve('@ksuni/swc-plugin-r-if'), {}]
  ]
})
```

## 常见问题

### SWC 插件版本

请注意，SWC 的插件仍然是一个实验性功能，目前 SWC 的 Wasm 插件是不向后兼容的，SWC 插件的版本与 Rspack 依赖的 `swc_core` 版本存在强耦合关系。

这意味着，你需要选择和当前 `swc_core` 版本匹配的 SWC 插件，才能使它正常执行。如果你使用的 SWC 插件版本与 Rspack 依赖的 `swc_core` 版本不匹配，Rspack 在执行构建时会抛出错误，请参考 [Rspack 常见问题 - SWC 插件版本不匹配](https://rspack.dev/zh/errors/swc-plugin-version) 进行处理。
