# Kmi
> Based on Umi to provide Rspack support and other best practices

## 简介

Kmi 为 [UmiJS](https://umijs.org/) 提供了 [Rspack](https://www.rspack.dev/) 支持以及现代 Web 开发的最佳实践。它旨在提供更快速、更高效的开发体验，并具有更好的构建性能。

## 特性
- **Rspack 集成**: 使用 Rspack 作为构建工具，相比 Webpack 构建速度提升数倍
- **平滑降级**: 提供 terser、postcss 等传统工具链支持，保证项目稳定性。新项目可无缝使用 lightningcss、swc 等新一代工具链，实现性能提升
- **简单易用**: 通过配置开关轻松切换 Rspack/Webpack 构建模式，遇到问题可快速回退
- **统一接口**: 提供统一的配置接口，屏蔽底层构建工具差异，降低学习成本

## 快速开始

### 安装

```bash
# 创建新的 Umi 项目
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
  // 开启 Rspack
  rspack: {},
  // 其他 Umi 配置...
  routes: [
    { path: '/', component: 'index' },
    { path: '/users', component: 'users' },
  ],
});
```

### 自定义构建配置

- 通过 bundler 选项来修改 Webpack(Rspack) 配置对象

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 开启 Rspack
  rspack: {},
  // 通过 bundler 选项来修改 Webpack(Rspack) 配置对象。
  bundler: {
    resolve: {
      // 与内置的 resolve.extensions 合并
      extensions: ['.web.tsx'],
    }
  }
});
```
- 以函数的形式修改 Webpack(Rspack) 配置
```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 开启 Rspack
  rspack: {},
  // 以函数的形式修改 Webpack(Rspack) 配置
  async bundler (config, { isProd }) {
    // 这里仅是示例
    if (isProd) {
      chain.devtool('source-map');
    }
    const { default: ESLintPlugin } = await import('eslint-webpack-plugin');
    config.plugins?.push(new ESLintPlugin());
    return config
  }
});
```

- 用链式编程的方式修改 Webpack(Rspack) 配置

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  // 配置 Kmi 预设
  presets: ['@kmijs/preset-bundler'],
  // 开启 Rspack
  rspack: {},
  // 通过 bundler 你可以拿到同时兼容 Webpack 和 Rspack 的插件
  bundlerChain (config, { bundler }) {
    // 这里仅是示例
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

## License

[MIT](./LICENSE)
