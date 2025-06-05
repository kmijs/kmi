# Kmi
> 基于 Umi 提供 Rspack 支持和其他最佳实践

<p>
  <a href="https://www.npmjs.com/package/@kmijs/preset-bundler?activeTab=readme"><img src="https://img.shields.io/npm/v/@kmijs/preset-bundler?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" /></a>
  <a href="https://npmcharts.com/compare/@kmijs/preset-bundler?minimal=true"><img src="https://img.shields.io/npm/dm/@kmijs/preset-bundler.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/@kmijs/preset-bundler.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="node version"></a>
  <a href="https://github.com/kmijs/kmi/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" /></a>
</p>

## 介绍

Kmi 为 [UmiJS](https://umijs.org/) 提供 [Rspack](https://www.rspack.dev/) 支持和现代化 Web 开发最佳实践。它旨在通过更好的构建性能提供更快、更高效的开发体验。

## 特性
- **Rspack 集成**：使用 Rspack 作为构建工具，相比 Webpack 提供数倍更快的构建速度
- **平滑降级**：提供对传统工具链如 terser 和 postcss 的支持以确保项目稳定性。新项目可以无缝使用下一代工具链如 lightningcss 和 swc 来提升性能
- **低成本接入**：通过配置开关轻松在 Rspack/Webpack 构建模式之间切换，出现问题时可快速降级
- **统一接口**：提供统一的配置接口，抽象了底层构建工具的差异，降低学习成本

## 快速开始

```
Kmi 依赖最新的 Umi 支持 如果你当前的 Umi 版本低于 `4.4.11`，可升级 `umi` 或者 `@umijs/max` 后在进行操作。
```

### 安装

```bash
# 创建一个新的 Umi 项目
npx create-umi@latest my-rspack-app
cd my-rspack-app

# 安装依赖
pnpm install
```

### 配置

在项目根目录创建或修改 `.umirc.ts` 文件：

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 启用 Rspack
  rspack: {},
  // 其他 Umi 配置...
  routes: [
    { path: '/', component: 'index' },
    { path: '/users', component: 'users' },
  ],
});
```

### 自定义构建配置

- 通过 bundler 选项修改 Webpack(Rspack) 配置对象

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 启用 Rspack
  rspack: {},
  // 通过 bundler 选项修改 Webpack(Rspack) 配置对象
  bundler: {
    resolve: {
      // 与内置的 resolve.extensions 合并
      extensions: ['.web.tsx'],
    }
  }
});
```
- 以函数形式修改 Webpack(Rspack) 配置
```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 启用 Rspack
  rspack: {},
  // 以函数形式修改 Webpack(Rspack) 配置
  async bundler (config, { isProd }) {
    // 这只是一个示例
    if (isProd) {
      chain.devtool('source-map');
    }
    const { default: ESLintPlugin } = await import('eslint-webpack-plugin');
    config.plugins?.push(new ESLintPlugin());
    return config
  }
});
```

- 使用链式编程修改 Webpack(Rspack) 配置

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 启用 Rspack
  rspack: {},
  // 通过 bundler 你可以获取与 Webpack 和 Rspack 兼容的插件
  bundlerChain (config, { bundler }) {
    // 这只是一个示例
    config.plugin('custom-define').use(bundler.DefinePlugin, [
      {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    ]);
    return config;
  }
});
```

### 开发

```bash
# 启动开发服务器
pnpm dev
```

### 生产构建

```bash
# 构建应用
pnpm build
```

## 许可证

[MIT](./LICENSE)
