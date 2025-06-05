# 环境变量

:::tip
可以直接参考 [Umi.js 的环境变量文档](https://umijs.org/docs/guides/env-variables)。本文档仅索引方便大家查看。
:::

Umi 可以通过环境变量来完成一些特殊的配置和功能。

## 默认环境变量

Umi 默认通过 [define](/config/config#define) 向代码中注入以下环境变量，它们会在构建时被替换为指定的值：

`process.env` 包含以下环境变量
- `process.env.NODE_ENV`
- `process.env.UMI_ENV`
- `process.env.BASE_URL`

### process.env.NODE_ENV
默认情况下，Kmi 会自动设置 `process.env.NODE_ENV` 环境变量，在开发模式为 'development'，生产模式为 'production'。

你可以在 Node.js 和 client 代码中直接使用 `process.env.NODE_ENV`

```js
if (process.env.NODE_ENV === 'development') {
  console.log('this is development');
}
```

### process.env.UMI_ENV

业务手动执行的运行环境变量, 可以在 client 代码中通过 `process.env.UMI_ENV` 访问 默认值为 `local`

```js
if (process.env.UMI_ENV === 'staging') {
  console.log('this is staging');
}
```

### process.env.BASE_URL
你可以在 client 代码中使用 `process.env.BASE_URL` 来访问服务端的基础路径，它由 [base](/config/config#base) 配置项决定，这有助于在代码中引用 public 目录 下的资源。

```js
const image = new Image();
image.src = `${process.env.BASE_URL}/favicon.ico`;
```

## 如何设置环境变量

### 执行命令时设置

例如需要改变 `umi dev` 开发服务器的端口，进可以通过如下命令实现。

:::code-group

```sh [OS X, Linux]
# OS X, Linux
$ PORT=3000 umi dev
```

```sh [Windows]
# Windows (cmd.exe)
$ set PORT=3000 && umi dev
```
:::

如果需要同时在不同的操作系统中使用环境变量(`如果需要兼容 Windows`)，推荐使用工具 [cross-env](https://github.com/kentcdodds/cross-env)

```sh
$ pnpm install cross-env -D
$ cross-env PORT=3000 umi dev
```

### 设置在 .env 文件中

如果你的环境变量需要在开发者之间共享，推荐你设置在项目根目录的 `.env` 文件中，例如:

``` [.env]
PORT=3000
BABEL_CACHE=none
```

然后执行，

```sh
$ umi dev
```

`umi` 会以 3000 端口启动 dev server，并且禁用 babel 的缓存。

如果你有部分环境变量的配置在本地要做特殊配置，可以配置在 `.env.local` 文件中去覆盖 `.env` 的配置。比如在之前的 `.env` 的基础上, 你想本地开发覆盖之前 3000 端口, 而使用 4000 端口，可以做如下定义。

```text [.env.local]
PORT=4000
```

`umi` 会以 4000 端口启动 dev server，同时保持禁用 babel 的缓存。

::: tip
`.env.*.local` 文件应是本地的，可以包含敏感变量。你应该将 `*.local` 添加到你的 `.gitignore` 中，以避免它们被 git 检入。
:::

### .env 文件
umi 使用 [dotenv](https://github.com/motdotla/dotenv) 从你当前应用执行的工作区中的下列文件加载额外的环境变量：
- `mode` 通过 `UMI_ENV` 注入可以在执行脚本中指定比如 `UMI_ENV=staging umi build`
- 在 Umi 中约定了 umi dev 的 env 为 `dev`, umi build 的 env 为 `prod`

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[UMI_ENV]         # 只在指定模式下加载
.env.[UMI_ENV].local   # 只在指定模式下加载，但会被 git 忽略
```

::: tip
请不要在 `.env` 文件中在设置 `UMI_ENV` 值否则 指定模式 env 配置不会加载
:::


此外，Umi 使用 [dotenv-expand](https://github.com/motdotla/dotenv-expand) 来扩展在 env 文件中编写的变量。想要了解更多相关语法，请查看 [它们的文档](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow)。

请注意，如果想要在环境变量中使用 `$` 符号，则必须使用 `\` 对其进行转义。

``` [.env]
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

### 在浏览器中使用环境变量
所有通过 `.env` 环境变量文件 或 命令行注入 的环境变量均默认只在 Umi 配置文件 (Node.js 环境) 内生效，在浏览器中无法直接通过 `process.env.VAR_NAME` 方式使用，通过进一步配置 [define](/config/config#define) 来注入到浏览器环境中

::: tip 注
默认我们约定所有以 `UMI_APP_` 开头的环境变量, 及 `UMI_ENV`, `NODE_ENV` 会默认注入到浏览器中，无需配置 `define` 手动注入。
:::

例如下面这些环境变量:

``` [.env]
UMI_APP_SOME_KEY=123
DB_PASSWORD=foobar
```

只有 `UMI_APP_SOME_KEY` 会被暴露为 `process.env.UMI_APP_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会

```ts
console.log(process.env.UMI_APP_SOME_KEY) // "123"
console.log(process.env.DB_PASSWORD) // undefined
```

- **通过 [define](/config/config#define) 配置注入到浏览器环境中**

``` [.env]
MY_TOKEN="xxxxx"
```

```ts [config/config.ts]
export default defineConfig({
  define: {
    'process.env.MY_TOKEN': process.env.MY_TOKEN // [!code ++]
  }
})
```

### TypeScript 的智能提示

当你在 `.env[UMI_ENV]` 文件中添加了大量自定义的环境变量时，为了获得更好的开发体验，你可以为这些以 `UMI_APP_` 为前缀的环境变量添加 TypeScript 类型定义。

只需在 `src` 目录下创建 `umi-env.d.ts` 文件，并按以下方式添加类型声明:

```ts [umi-env.d.ts]
declare namespace NodeJS {
  interface ProcessEnv {
    UMI_ENV: 'local' | 'staging' | 'prt' | 'online';
    readonly UMI_APP_TITLE: string
    // 更多环境变量 ...
  }
}
```

## 环境变量

按字母顺序排列。

### APP_ROOT

指定项目根目录。

注意：

* APP_ROOT 不能配在 .env 中，只能在命令行里添加

### ANALYZE

用于分析 bundle 构成，默认关闭。

比如：

```sh
$ ANALYZE=1 umi dev
# 或者
$ ANALYZE=1 umi build
```

### COMPRESS

默认压缩 CSS 和 JS，值为 none 时不压缩，build 时有效。


### FS_LOGGER
默认会开启保存物理日志，值为 none 时不保存，同时针对 webcontainer 场景（比如 stackbliz）暂不保存。

### HMR
默认开启 HMR 功能，值为 none 时关闭。

### HOST

默认是 `0.0.0.0`。

### PORT

指定端口号，默认是 `8000`。

### SOCKET_SERVER

指定用于 HMR 的 socket 服务器。比如：

```sh
$ SOCKET_SERVER=https://localhost:7001/ umi dev
```

### SPEED_MEASURE

分析 Webpack 编译时间，支持 `CONSOLE` 和 `JSON` 两种格式，默认是 `CONSOLE`。

```sh
$ SPEED_MEASURE=JSON umi dev
```

### UMI_ENV

当指定 `UMI_ENV` 时，会额外加载指定值的配置文件
注：根据当前环境的不同，`dev`, `prod`, `test` 配置文件会自动加载，不能将 `UMI_ENV` 的值设定成他们。

### UMI_PLUGINS

指定 umi 命令执行时额外加载的插件的路径，使用 `,` 隔开。

```sh
$ UMI_PLUGINS=./path/to/plugin1,./path/to/plugin2  umi dev
```

### UMI_PRESETS

指定 `umi` 命令执行时额外加载插件集的路径，使用 `,` 隔开。

```sh
$ UMI_PRESETS=./path/to/preset1,./path/to/preset2  umi dev
```

### WEBPACK_FS_CACHE_DEBUG

开启 webpack 的物理缓存 debug 日志。

```sh
$ WEBPACK_FS_CACHE_DEBUG=1 umi dev
```

### ERROR_OVERLAY

禁用 `react-error-overlay` 提示
