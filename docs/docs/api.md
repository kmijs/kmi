# API

在 Umi 中可以通过插件消费 Kmi 暴露的 Hook 来扩展 Rspack 相关的能力，所有插件 API 都通过 `api` 对象暴露。

## 扩展方法

通过 KMI 提供的扩展方法，可以注册各种 hook 来修改编译配置、添加功能等。

### addExtraSwcPlugins

添加额外的 SWC 插件。

```typescript
api.addExtraSwcPlugins(() => {
  return [
    ['@swc/plugin-emotion', {}],
    ['@swc/plugin-styled-components', { displayName: true }]
  ];
});
```

参数：
- 返回值：`Array<[string, any]>` - SWC 插件数组，每项包含插件名和配置

### modifySwcLoaderOptions

修改 SWC Loader 的配置选项。

```typescript
api.modifySwcLoaderOptions((opts, { env, isServer, isWebWorker, target }) => {
  if (env === 'development') {
    opts.jsc = {
      ...opts.jsc,
      transform: {
        ...opts.jsc?.transform,
        react: {
          ...opts.jsc?.transform?.react,
          development: true,
        },
      },
    };
  }
  return opts;
});
```

参数：
- `opts: SwcLoaderOptions` - 当前的 SWC Loader 配置
- `args: { env: Env, isServer: boolean, isWebWorker: boolean, target: KmiTarget }` - 环境信息

返回值：修改后的 SWC Loader 配置

### modifyRspackBabelLoaderOptions

修改 Rspack Babel Loader 的配置选项。

```typescript
api.modifyRspackBabelLoaderOptions((opts, utils) => {
  // 添加自定义 Babel 插件
  opts.plugins = opts.plugins || [];
  opts.plugins.push(['babel-plugin-import', { libraryName: 'antd' }]);
  return opts;
});
```

参数：
- `opts: RspackBabelLoaderOptions` - 当前的 Babel Loader 配置
- `utils: RspackBabelConfigUtils` - Babel 配置工具类

返回值：修改后的 Babel Loader 配置

### modifyBundlerConfig

修改打包器（Rspack）的配置。

```typescript
api.modifyBundlerConfig((config, { env, target, isServer, isWebWorker }) => {
  if (env === 'development') {
    config.devtool = 'eval-cheap-module-source-map';
  }

  // 添加自定义 resolve 配置
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': paths.absSrcPath,
  };

  return config;
});
```

参数：
- `config: Configuration` - 当前的 Rspack 配置
- `utils: ModifyBundlerConfigUtils` - 包含环境和目标信息的工具对象

返回值：修改后的 Rspack 配置

### bundlerChain

通过链式调用的方式修改打包器配置。类似于 webpack-chain。

```typescript
api.bundlerChain((chain, { env, target, isServer, isWebWorker }) => {
  // 设置别名
  chain.resolve.alias
    .set('@', paths.absSrcPath)
    .set('@@', paths.absTmpPath);

  // 添加插件
  if (env === 'production') {
    chain.plugin('bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  }

  // 修改 loader
  chain.module
    .rule('typescript')
    .test(/\.tsx?$/)
    .use('swc-loader')
    .loader('swc-loader')
    .options({
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
      },
    });
});
```

参数：
- `chain: RspackChain` - Rspack 链式配置对象
- `utils: ModifyChainUtils` - 包含环境和目标信息的工具对象

### chainWebpack

兼容 UmiJS 的 `chainWebpack` API，通过 webpack-chain 的方式修改配置。

```typescript
api.chainWebpack((chain, { env, target }) => {
  // 设置别名
  chain.resolve.alias.set('react', require.resolve('react'));

  // 添加插件
  chain.plugin('define')
    .use(require('webpack').DefinePlugin, [{
      'process.env.NODE_ENV': JSON.stringify(env),
    }]);
});
```

参数：
- `chain: RspackChain` - 链式配置对象
- `utils: BasicChainUtils` - 基本的链式配置工具

### addBabelPresets

添加 Babel 预设。

```typescript
api.addBabelPresets(() => {
  return [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }]
  ];
});
```

参数：
- 返回值：Babel 预设数组

## 事件类 API

### onBeforeCreateCompiler

在创建编译器之前触发的事件。

```typescript
api.onBeforeCreateCompiler(({ env, target, isServer, isWebWorker }) => {
  console.log(`准备创建编译器: ${env} 模式`);
  // 可以在这里做一些预处理工作
});
```

参数：
- `opts: IOnBeforeCreateCompilerOpts` - 包含环境信息的配置对象

### onAfterCreateCompiler

在创建编译器之后触发的事件。

```typescript
api.onAfterCreateCompiler(({ compiler, env, target }) => {
  console.log('编译器创建完成');

  // 可以监听编译器事件
  compiler.hooks.done.tap('MyPlugin', (stats) => {
    console.log('编译完成');
  });
});
```

参数：
- `opts: IOnAfterCreateCompilerOpts` - 包含编译器实例和环境信息的配置对象

## 类型定义

### Env

环境类型，可能的值：
- `'development'` - 开发环境
- `'production'` - 生产环境

### KmiTarget

构建目标类型，支持多种目标：
- `'web'` - Web 应用
- `'node'` - Node.js 应用
- `'webworker'` - Web Worker

### SwcLoaderOptions

SWC Loader 的配置选项，包含 SWC 编译器的各种配置。

### RspackBabelLoaderOptions

Rspack 中 Babel Loader 的配置选项。

### Configuration

Rspack 的完整配置类型。

### RspackChain

链式配置对象，提供类似 webpack-chain 的 API。

## 使用示例

以下是一个完整的插件示例，展示如何使用多个 API：

```typescript
import type { IApi } from 'umi';

export default (api: IApi) => {
  // 添加 SWC 插件
  api.addExtraSwcPlugins(() => [
    ['@swc/plugin-emotion', {}]
  ]);

  // 修改 SWC 配置
  api.modifySwcLoaderOptions((opts, { env }) => {
    if (env === 'development') {
      opts.jsc = {
        ...opts.jsc,
        transform: {
          ...opts.jsc?.transform,
          react: {
            development: true,
            refresh: true,
          },
        },
      };
    }
    return opts;
  });

  // 使用链式方式修改配置
  api.bundlerChain((chain, { env }) => {
    chain.resolve.alias.set('@', api.paths.absSrcPath);

    if (env === 'development') {
      chain.devtool('eval-cheap-module-source-map');
    }
  });

  // 监听编译器事件
  api.onAfterCreateCompiler(({ compiler }) => {
    compiler.hooks.done.tap('MyPlugin', () => {
      console.log('编译完成');
    });
  });
};
```

这个示例展示了如何：
1. 添加 SWC 插件来处理特定的代码转换
2. 根据环境修改 SWC 配置
3. 使用链式 API 设置别名和开发工具
4. 监听编译完成事件

通过这些 API，你可以灵活地扩展 Umi 的功能，满足项目的特定需求。
