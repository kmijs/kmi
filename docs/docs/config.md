# 配置

## bundler

- 类型：`Configuration | ((memo: Configuration, utils: ModifyBundlerConfigUtils) => Configuration)`
- 默认值：`undefiend`

`bundler` 选项用于修改 `Webpack(Rspack)` 的配置项。

::: tip
Kmi 内置的 Webpack(Rspack) 配置会随着迭代而发生变化，这些变化不会反映在 semver 中，因此在升级 Kmi 时，你的自定义配置可能会失效。因此
通常我们并不推荐大家直接操作原生构建配置, 如有插件或者能力的支持诉求可以联系 Kmi Oncall 寻求支持
:::

### bundler value 是对象
- 类型：`Configuration`
- 默认值：`undefiend`

可以配置为一个对象，这个对象将会和内置的 `Webpack(Rspack)` 配置通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 进行深层合并。

比如添加 `resolve.extensions` 配置:

:::tip
在合并配置时，`webpack-merge` 会自动合并数组，比如 `plugins`、`module.rules`、`resolve.extensions` 等配置。
:::

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

如果你需要覆盖某个配置项，而不是与默认值合并，可以使用 `bundler` 的函数类型。

### bundler value 是函数

- 类型：`((memo: Configuration, utils: ModifyBundlerConfigUtils) => Configuration)`
- 默认值：`undefiend`

`bundler` 也可以配置为一个函数，这个函数接收一个参数，即内置的 `Webpack(Rspack)` 配置对象，你可以对这个对象进行修改，然后返回一份新的配置。比如

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

::: tip
`bundler` 函数返回的对象会直接作为最终使用的 `Webpack(Rspack)` 配置，不会再与内置的构建配置进行合并。
:::

### bundler 工具函数

这个函数的第二个参数是一个对象，包含了一些工具函数和属性

#### env

- 类型：`'development' | 'production'`

通过 `env` 参数可以判断当前环境为 development、production。比如：

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { env }) {
    // 这里仅是示例
    if (env === 'development') { // [!code ++]
      config.devtool = 'cheap-module-eval-source-map';
    }
    return config;
  }
})
```

#### isDev

- 类型：`boolean`

用于判断当前是否为开发模式构建，比如：

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { isDev }) {
    if (isDev) { // [!code ++]
      // 这里仅是示例
      config.devtool = 'cheap-module-eval-source-map';
    }
    return config;
  }
})
```

#### isProd

- 类型：`boolean`

用于判断当前是否为生产模式构建，比如：

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { isProd }) {
    if (isProd) { // [!code ++]
      // 这里仅是示例
      config.devtool = 'source-map';
    }
    return config;
  }
})
```

#### rspack
<OnlyRspack />

- 类型：`Rspack`

::: warning
不建议直接使用, 不利于 Rspack Webpack 平滑切换
:::

通过这个参数你可以拿到 `Rspack` 实例。比如：

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { rspack }) {
    config.plugins?.push(new rspack.ProvidePlugin()); // [!code ++]
    return config;
  }
})
```

#### webpack

<OnlyWebpack />

- 类型：`Webpack`

::: warning
不建议直接使用, 不利于 Rspack Webpack 平滑切换
:::

通过这个参数你可以拿到 `Webpack` 实例。比如：

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { webpack }) {
    config.plugins?.push(new webpack.ProvidePlugin()); // [!code ++]
    return config;
  }
})
```

#### bundler

- 类型：

```ts
type bundler = {
  BannerPlugin: BundlerPluginInstance
  DefinePlugin: BundlerPluginInstance
  IgnorePlugin: BundlerPluginInstance
  ProvidePlugin: BundlerPluginInstance
  HotModuleReplacementPlugin: BundlerPluginInstance
}
```
通过这个插件你可以拿到同时兼容 `Webpack` 和 `Rspack` 的插件

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { bundler }) {
    config.plugins?.push(new bundler.ProvidePlugin()); // [!code ++]
    return config;
  }
})
```

#### addRules

- 类型：`(rules: BundlerRule | BundlerRule[]) => void`

添加额外的 [Webpack(Rspack) rules](https://rspack.dev/config/module#modulerules) 到 `Webpack(Rspack)` rules 列表的最前面。

需要注意的是，`Webpack(Rspack)` loaders 会按照从右到左的顺序执行，如果你希望你添加的 loader（Normal Phase）先于其他 loader 执行，应使用 [appendRules](#appendRules) 将该规则添加到最后面。

示例：
```ts [config/config.ts]
export default defineConfig({
  bundler (config, { addRules }) {
    // 添加单条规则
    addRules({ // [!code ++]
      test: /\.foo/,
      loader: 'foo-loader-one',
    });

    // 以数组形式添加多条规则
    addRules([ // [!code ++]
      {
        test: /\.foo/,
        loader: 'foo-loader',
      },
      {
        test: /\.bar/,
        loader: 'bar-loader',
      },
    ]);
    return config;
  }
})
```

#### appendRules

- 类型：`(rules: BundlerRule | BundlerRule[]) => void`

添加额外的 [Webpack(Rspack) rules](https://rspack.dev/config/module#modulerules) 到 `Webpack(Rspack)` rules 列表的最后面。

示例：
```ts [config/config.ts]
export default defineConfig({
  bundler (config, { appendRules }) {
    // 添加单条规则
    appendRules({ // [!code ++]
      test: /\.foo/,
      loader: 'foo-loader-one',
    });

    // 以数组形式添加多条规则
    appendRules([ // [!code ++]
      {
        test: /\.foo/,
        loader: 'foo-loader',
      },
      {
        test: /\.bar/,
        loader: 'bar-loader',
      },
    ]);
    return config;
  }
})
```

#### prependPlugins

- 类型：`BundlerPluginInstance | BundlerPluginInstance[]`

在内部 `Webpack(Rspack)` 插件数组头部添加额外的插件，数组头部的插件会优先执行。

示例：
```ts [config/config.ts]
export default defineConfig({
  bundler (config, { prependPlugins }) {
    // 添加单个插件
    prependPlugins([new PluginA()]) // [!code ++]
    // 以数组形式添加多个插件
    prependPlugins([new PluginB(), new PluginC()]) // [!code ++]
    return config;
  }
})
```

#### appendPlugins

- 类型：`BundlerPluginInstance | BundlerPluginInstance[]`

在内部 `Webpack(Rspack)` 插件数组尾部添加额外的插件，数组尾部的插件会在最后执行。

示例：
```ts [config/config.ts]
export default defineConfig({
  bundler (config, { appendPlugins }) {
    // 添加单个插件
    appendPlugins([new PluginA()]) // [!code ++]
    // 以数组形式添加多个插件
    appendPlugins([new PluginB(), new PluginC()]) // [!code ++]
    return config;
  }
})
```

#### removePlugin

- 类型：`string`

删除内部的 `Webpack(Rspack)` 插件，参数为该插件的 `constructor.name`。

例如，删除内部的 `webpack-bundle-analyzer`

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { removePlugin }) {
    removePlugin('webpack-bundle-analyzer') // [!code ++]
    return config;
  }
})
```

#### mergeConfig

- 类型：`(...configs:Configuration[]) => Configuration`

用于合并多份 `Webpack(Rspack)` 配置，等价于 `webpack-merge`。

```ts [config/config.ts]
export default defineConfig({
  bundler (config, { mergeConfig }) {
    return mergeConfig(config, { // [!code ++]
      devtool: 'eval',
    });
  }
})
```

## bundlerChain

<ApiMeta addedVersion="2.0.0" inline />

- 类型：`(memo: RspackChain, args: ModifyChainUtils) => void`
- 默认值：`undefiend`

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

    // 删除 kmi 内置插件
    memo.plugins.delete('hmr') // [!code ++]
  }
})
```

### bundlerChain 工具函数

#### env

- 类型：`'development' | 'production'`

通过 `env` 参数可以判断当前环境为 development、production。比如：

```ts [config/config.ts]
export default defineConfig({
  bundlerChain (config, { env }) {
    // 这里仅是示例
    if (env === 'development') { // [!code ++]
      config.devtool('cheap-module-eval-source-map');
    }
    return config;
  }
})
```

#### isDev

- 类型：`boolean`

用于判断当前是否为开发模式构建，比如：

```ts [config/config.ts]
export default defineConfig({
  bundlerChain (config, { isDev }) {
    if (isDev) { // [!code ++]
      // 这里仅是示例
      config.devtool('cheap-module-eval-source-map');
    }
    return config;
  }
})
```

#### isProd

- 类型：`boolean`

用于判断当前是否为生产模式构建，比如：

```ts [config/config.ts]
export default defineConfig({
  bundlerChain (config, { isProd }) {
    if (isProd) { // [!code ++]
      // 这里仅是示例
      config.devtool('source-map');
    }
    return config;
  }
})
```

#### bundler

- 类型：

```ts
type bundler = {
  BannerPlugin: BundlerPluginInstance
  DefinePlugin: BundlerPluginInstance
  IgnorePlugin: BundlerPluginInstance
  ProvidePlugin: BundlerPluginInstance
  HotModuleReplacementPlugin: BundlerPluginInstance
}
```
通过这个插件你可以拿到同时兼容 `Webpack` 和 `Rspack` 的插件

```ts [config/config.ts]
export default defineConfig({
  bundlerChain (config, { bundler }) {
    // 这里仅是示例
    config.plugin('custom-define').use(bundler.DefinePlugin, [ // [!code ++]
      {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    ]);
    return config;
  }
})
```
