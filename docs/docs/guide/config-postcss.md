# 配置 PostCss

Kmi 默认集成 PostCss, 在 Kmi 中可以通过 `postcss-loader`、 `extraPostCSSPlugins` 自定义 PostCss

## 自定义

### 配置 postcss-loader

配置 loader，下面例子是通过 postcss 支持 CSS-in-JS.

```ts [config/config.ts]
export default defineConfig({
  postcssLoader:{
    postcssOptions: {
      parser: "postcss-js",
      execute: true,
    }
});
```

更多 [options](https://github.com/webpack-contrib/postcss-loader#options)

### 配置 PostCss 插件

在 Kmi 中可以通过 [extraPostCSSPlugins](/config/config#extrapostcssplugins) 来配置额外的 PostCss 插件

比如

```ts config/config.ts
export default defineConfig({
  extraPostCSSPlugins:[
    require('postcss-px-to-viewport')({
      viewportWidth: 375,
    });
  ]
});
```

## 注意事项

### PostCSS 版本
Kmi 中使用的 PostCSS 版本为 v8，当你引入社区中的 PostCSS 插件时，请注意版本是否适配，部分旧版本插件可能无法在 PostCSS v8 下运行。

### Rspack PostCSS 插件启用
默认情况下 Rspack 使用 `builtin:lightningcss-loader` 处理 css, 替代 `postcss-loader` 中的降级功能，让 CSS 编译更快。
当配置 `extraPostCSSPlugins` 包含值时, 启用 `postcss` 能力
