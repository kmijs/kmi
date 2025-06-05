# 配置构建工具

Kmi 支持直接修改 `Webpack(Rspack)` 配置对象，也支持通过 [rspack-chain](https://github.com/rspack-contrib/rspack-chain) 来修改 Kmi 内置的 `Webpack(Rspack)` 配置。

## 查看配置

Kmi 提供了 `umi inspect` 命令来查看 Kmi 最终生成的 `Webpack(Rspack)` 配置。

## 通过配置修改

你可以使用 Kmi 的 [bundler](/config/bundler-config#bundler) 选项来修改 `Webpack(Rspack)` 配置对象。

比如添加 `resolve.extensions` 配置

```ts [config/config.ts]
export default defineConfig({
  bundler: {
    resolve: {
      // 与内置的 resolve.extensions 合并
      extensions: ['.web.tsx'],  // [!code ++]
    }
  }
})
```

比如以函数的形式修改  `Webpack(Rspack)` 配置：

```ts [config/config.ts]
export default defineConfig({
  async bundler (config, { isProd }) {
    // 这里仅是示例
    if (isProd) {
      chain.devtool('source-map'); // [!code ++]
    }
    const { default: ESLintPlugin } = await import('eslint-webpack-plugin');
    config.plugins?.push(new ESLintPlugin());  // [!code ++]
    return config
  }
})
```

> 请查看 [bundler 文档](/config/bundler-config#bundler) 来了解完整用法。

## 使用 Rspack Chain {#config-rspack-chain}

用链式编程的方式修改 `Webpack(Rspack)` 配置, 基于[rspack-chain](https://github.com/rspack-contrib/rspack-chain), 它提供了链式 API，使得配置 `Webpack(Rspack)` 变得更加灵活。通过使用 `rspack-chain`，你可以更方便地修改和扩展 `Webpack(Rspack)` 配置，而不需要直接操作复杂的配置对象。

:::tip
Kmi 内置的 `Webpack(Rspack)` 配置会随着迭代而发生变化，这些变化不会反映在 semver 中，因此在升级 Kmi 时，你的自定义配置可能会失效。
:::

你可以通过 `bundlerChain` 来调用 `rspack-chain` 以修改默认的 `Webpack(Rspack)` 配置，它的值是一个函数，接收两个参数
- 第一个参数为 rspack-chain 实例，你可以通过它来修改 `Webpack(Rspack)` 配置。
- 第二个参数为一个工具对象，包括 `env`、`isProd`、`bundler` 等

> `bundlerChain` 会早于 [bundler](#bundler) 被执行，因此会被 `bundler` 覆盖。

示例:

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo, { isDev }) {
    //  使用工具函数
    if (isDev) {
      memo.devtool('cheap-module-eval-source-map'); // [!code ++]
    }

    // 添加额外插件
    const { default: ESLintPlugin } = await import('eslint-webpack-plugin');
    memo.plugin('eslint-plugin').use(ESLintPlugin) // [!code ++]
  }
})
```

> 请查看 [bundlerChain 文档](/config/bundler-config#bundlerchain) 来了解完整用法。

### 示例

####  配置 loader
下面是新增、修改和删除 `Webpack(Rspack)` loader 的示例。

- 新增一个 loader 来处理 `.md` 文件：

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo) {
    memo.module
      .rule('md')
      .test(/\.md$/)
      .use('md-loader')
      // loader 的包名或模块路径
      .loader('md-loader');
  }
})
```

- 修改内置的 SWC loader 选项

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo) {
    memo.module
      .rule('src')
      .use('swc')
      .tap((options) => {
        console.log(options);
        return options;
      });
  }
})
```

- 删除内置的 SWC loader

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo) {
    memo.module.rule('src').uses.delete('swc');
  }
})
```

- 在内置的 SWC loader 之后插入一个 loader，它会早于 SWC loader 执行

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo) {
    memo.module
      .rule('src')
      .use('swc-babel')
      .after('swc')
      // loader 的包名或模块路径
      .loader('babel-loader')
      .options({
        // some options
      });
  }
})
```

> 注意：loader 是以相反顺序执行的

- 在内置的 SWC loader 之前插入一个 loader，它会晚于 SWC loader 执行

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo) {
    memo.module
      .rule('src')
      .use('swc-babel')
      .before('swc')
      // loader 的包名或模块路径
      .loader('babel-loader')
      .options({
        // some options
      });
  }
})
```

- 删除内置的 静态资源处理

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo) {
    memo.module.rules.delete('asset')
  }
})
```

#### 配置 Plugin

下面是新增、修改和删除 Bundler 插件的示例

```ts [config/config.ts]
export default defineConfig({
  async bundlerChain(memo, { bundler }) {
    // 新增插件
    memo.plugin('custom-define').use(bundler.DefinePlugin, [
      {
        'process.env.DEMO': JSON.stringify(process.env.NODE_ENV)
      },
    ]);

    // 修改插件
    config.plugin('fastRefresh').tap((args) => [
      {
        ...args[0],
        library: 'demo',
      },
    ])

    // 删除插件
    memo.plugins.delete('fastRefresh');
  }
})
```

#### 根据环境修改

在 `bundlerChain` 函数的第二个参数中，你可以拿到各种环境的标识，如开发/生产模式构建，从而实现不同环境下的配置修改。

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { isDev, isProd }) {
    if (isDev) {
      // 这里仅是示例
      config.devtool = 'cheap-module-eval-source-map';
    }
    if (isProd) {
      // 这里仅是示例
      config.devtool = 'source-map';
    }
    return config;
  }
})
```

## 通过插件修改

在 Kmi 中提供了 [modifyBundlerConfig](/api#modifyBundlerConfig)、 [bundlerChain](/api#bundlerChain) 修改默认的 Webpack(Rspack) 配置

示例

- modifyBundlerConfig
```ts
api.modifyBundlerConfig((memo, { addRules, appendPlugins }) => {
  memo.resolve ||= {}
  memo.resolve.alias ||= {}
  memo.resolve.alias['@b'] = '@/b';

  // 添加 loader
  addRules({
    test: /\.foo-plugin/,
    loader: 'foo-plugin-loader',
  });

  // 添加插件
  appendPlugins([new PluginE()])
  return memo
})
```

- bundlerChain
```ts
api.bundlerChain((memo, { isDev }) => {
  //  使用工具函数
  if (isDev) {
    memo.devtool('cheap-module-eval-source-map');
  }

  // 添加额外插件
  const { default: ESLintPlugin } = await import('eslint-webpack-plugin');
  memo.plugin('eslint-plugin').use(ESLintPlugin)
})
```

## 配置修改顺序

Kmi 支持通过 `bundler`、`bundlerChain`、`api.bundlerChain`、 `api.modifyBundlerConfig` 等方式修改 Webpack(Rspack) 配置对象。

它们之间的执行顺序依次为：
- api.bundlerChain
- bundlerChain
- api.modifyBundlerConfig
- bundler
