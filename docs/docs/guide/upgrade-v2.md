# 升级到 Rspack v2

KMI 在新版本中将底层构建引擎从 Rspack 1.x 升级到了 Rspack 2.0。这篇文档会介绍此次升级带来的变化，以及你可能需要做的调整。

## 概览

Rspack 2.0 是一次重大升级，带来了性能优化、更现代的 API 设计，以及若干破坏性变更。KMI 已将绝大多数变更封装在内部，**对于使用标准 KMI 配置的开发者来说，此次升级几乎是无感的**。

## Node.js 版本要求

Rspack 2.0 要求最低 Node.js 版本为 **20.19.0+** 或 **22.12.0+**，不再支持 Node.js 16 和 18。

如果你当前使用较低版本的 Node.js，请在升级 KMI 之前先升级 Node.js：

```bash
node -v  # 确认版本 >= 20.19.0
```

## 升级步骤

1. **升级 Node.js** 到 `>= 20.19.0`
2. **升级 KMI 版本** — 新版本已包含 `@rspack/core` v2 及相关依赖
3. **重新安装依赖**：

```bash
npm install   # 或 pnpm install / yarn install
```

## 用户配置兼容性

以下 KMI 配置项在 Rspack v2 中**完全向后兼容**，你无需修改任何代码：

| 配置项 | 说明 |
|--------|------|
| `transformImport` | 内部实现由 `rspackExperiments.import` 迁移至 `transformImport` 选项，用户配置无需变更 |
| `rspack.incremental` | 内部由 `experiments.incremental` 提升为顶层 `incremental` 配置，用户配置无需变更 |
| `rspack.lazyCompilation` | 内部由 `experiments.lazyCompilation` 提升为顶层 `lazyCompilation` 配置，用户配置无需变更 |
| `esm` | 内部由 `experiments.outputModule` 迁移至 `output.module`，用户配置无需变更 |
| `javascriptExportsPresence` | 行为不变，配置为 `false` 时降级为 `warn`，否则为 `error` |
| `rspack.useBabel` | 无变化，继续兼容 |

## 自定义 chainWebpack / 插件迁移

如果你在项目中使用 `chainWebpack` 直接操作 Rspack 底层配置，或者编写了自定义 Rspack 插件，需要注意以下变更：

### experiments 选项迁移

Rspack v2 将 `experiments` 中的多个实验性选项移到了顶层配置或直接移除：

| v1 配置 | v2 变化 |
|---------|---------|
| `experiments.lazyCompilation` | 移至顶层 `lazyCompilation` |
| `experiments.incremental` | 移至顶层 `incremental` |
| `experiments.outputModule` | 移至 `output.module` |
| `experiments.topLevelAwait` | 已稳定，ESM 模块默认启用 |
| `experiments.css` | 已移除，CSS 处理能力默认可用 |
| `experiments.rspackFuture` | 已移除，其中 `bundlerInfo` 移至 `output.bundlerInfo` |

如果你在 `chainWebpack` 中有类似以下代码：

```ts
// v1 写法（不再生效）
chainWebpack(config) {
  config.experiments({
    ...config.toConfig().experiments,
    lazyCompilation: { ... }
  })
}
```

建议改用 KMI 提供的 `rspack.lazyCompilation` 配置项，或直接使用顶层 API：

```ts
// 推荐：使用 KMI 配置
export default defineConfig({
  rspack: {
    lazyCompilation: true
  }
})

// 或者在 chainWebpack 中使用 v2 顶层 API
chainWebpack(config) {
  config.set('lazyCompilation', { ... })
}
```

### Runtime Module API 变更

Rspack v2 移除了 Runtime module 的 `constructorName` 和 `moduleIdentifier` 属性。自定义插件中应改用标准 API：

```ts
// v1 写法（不再生效）
module.constructorName
module.moduleIdentifier

// v2 写法
module.constructor.name
module.identifier()
```

### ProgressPlugin 回调变更

如果你使用自定义的 `chainWebpack` 注册了 [ProgressPlugin](https://rspack.rs/plugins/webpack/progress-plugin)，注意回调参数已变更：

- 第三个参数从 `items: string[]` 变为结构化的 `info` 对象（`{ builtModules, moduleIdentifier }`）

### output.library\* 系列 API 迁移

Rspack v2 将多个 `output.*` 选项合并到了 `output.library` 子对象中：

| v1 配置 | v2 配置 |
|---------|---------|
| `output.libraryTarget` | `output.library.type` |
| `output.libraryExport` | `output.library.export` |
| `output.umdNamedDefine` | `output.library.umdNamedDefine` |
| `output.auxiliaryComment` | `output.library.auxiliaryComment` |

KMI 内置了兼容层，会自动将旧 API 转换为新 API（如 qiankun 插件使用的 `libraryTarget`）。但如果你在自定义 `chainWebpack` 中直接使用了这些旧选项，建议迁移：

```ts
// v1 写法（兼容层会自动转换，但建议迁移）
config.output.libraryTarget('umd')
config.output.libraryExport('MyLib')

// v2 写法
config.output.library({ type: 'umd', export: 'MyLib' })
```

### `optimization.removeAvailableModules` 移除

此配置在 Rspack 中无实际效果，v2 已直接移除。如果你的代码中显式设置了它，可以安全删除。

### `profile` 配置移除

顶层 `profile` 和 `stats.profile` 配置已移除。如需性能分析，推荐使用 [Rsdoctor](https://rspack.rs/guide/optimization/use-rsdoctor)。

## 其他内部变更

以下变更是 KMI 框架内部的调整，对用户侧完全透明，仅作参考：

- `@rspack/core` 升级为纯 ESM 包，Node.js 20.19+ 通过 `require(esm)` 原生支持，不影响使用
- `@rspack/plugin-react-refresh` 升级至 v2，React 热更新行为无变化
- `@rspack/lite-tapable` 升级至 1.1.0
- `experiments.nativeWatcher` 已移除（文件监听已稳定，默认启用）

## 遇到问题？

如果升级后遇到问题，请先检查：

- Node.js 版本是否满足 `>= 20.19.0`
- 依赖是否正确安装（删除 `node_modules` 和 lockfile 后重新 `pnpm install`）

如果问题仍然存在，请在 [GitHub Issues](https://github.com/kmijs/kmi/issues) 提交反馈。
