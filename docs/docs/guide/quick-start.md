# 快速开始

## 环境准备

### Node.js

在开始使用前，你需要安装 [Node.js](https://nodejs.org/en/)，并保证 Node.js 版本不低于 `16.2.0`，我们推荐使用 Node.js `18` 的 LTS 版本。
你可以通过以下命令检查当前使用的 Node.js 版本：

```sh
node -v
```

如果你的环境中尚未安装 Node.js，或是版本过低，可以通过 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 安装。

下面是通过 `nvm` 安装的例子：

```sh
# 安装 Node.js 18 的长期支持版本
nvm install 18 --lts

# 将刚安装的 Node.js 18 设置为默认版本
nvm alias default 18

# 切换到刚安装的 Node.js 18
nvm use 18
```

### pnpm

推荐使用 [pnpm](https://pnpm.io/zh/) 来管理依赖, 并设置内网源：

- 安装 `pnpm`

```sh
# 使用脚本安装
$ curl -fsSL https://get.pnpm.io/install.sh | sh -

# 使用 npm 安装
$ npm install -g pnpm
```

## 创建 Kmi 项目

### 通过命令行创建

::: code-group

```sh [pnpm]
pnpm dlx @kmijs/create-kmi@latest hello-kmi
```

```sh [yarn]
yarn create @kmijs/kmi@latest hello-kmi
```

```sh [npm]
npm init @kmijs/kmi@latest hello-kmi hello-kmi
```

```sh [bun]
bun create @kmijs/kmi@latest hello-kmi
```
:::

* `hello-kmi` 是你的项目名, 就根据实际需要指定

## 启动项目

在项目中执行 `pnpm dev` 即可启动项目：

```sh
> pnpm dev
info  - Using Rspack v1.3.10
info  - Umi v4.4.11
info  - Preparing...
info  - 启用 less 多线程编译
        ╔════════════════════════════════════════════════════╗
        ║ App listening at:                                  ║
        ║  >   Local: http://localhost:8000                  ║
ready - ║  > Network: http://192.168.31.232:8000             ║
        ║                                                    ║
        ║ Now you can open browser with the above addresses↑ ║
        ╚════════════════════════════════════════════════════╝
      -  ➜ press h + enter to show help

event - [Kmi] Compiled in 334 ms (561 modules)

在浏览器中打开 `http://localhost:8000/`，可以看到页面内容。
```

## 使用配置
通过 `create-kmi` 创建的 Umi 项目中，会默认生成 `.umirc.ts` 文件。

你可以通过该配置文件修改配置，覆盖 `Umi` 的默认行为。例如添加如下配置别名

```ts [config/config.ts]
import { defineConfig } from 'umi'

export default defineConfig({
  alias: {
   lodash: 'lodash-es' // [!code ++]
  }
});
```
配置完成后会自动重启服务

## 部署发布

执行 `pnpm build` 命令

产物默认会生成到 `./dist` 目录下

```sh
./dist
├── index.html
├── umi.css
└── umi.js
```

完成构建后，就可以把 `dist` 目录部署到服务器上了。
