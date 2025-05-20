# 贡献指南

## 环境准备

### 安装 Node.js 和 pnpm 工具

开发 Kmi 需要 Nodejs.18+ 和 pnpm v8 +

- 推荐使用 nvm 管理 Nodejs
- pnpm 安装 在 [pnpm 官网](https://pnpm.io/installation) 选择你喜欢的形式即可

### 了解工作区

开发之前请先了解[工作区](https://pnpm.io/zh/workspaces)的原理

## pull request
在你发送 Pull Request 之前，请确认你是按照下面的步骤来做的：

pr checklist
- ✅ 确保 prettier simple-git-hooks lint-staged 正常工作提交代码时会做 format、lint
- ✅ 确保 本地测试通过 用 pnpm test 验证
- ✅ 确保 ts types 检验通过 pnpm typecheck
- ✅ 一个 pr 只做一件事情, 不要把多个改动合并到一个 pr 中提交
- ✅ 复杂逻辑需要写注释及编写测试用例
- ✅ 新增加的依赖需要锁定版本
- ✅ 功能配置的新增, 删除, 修改需要同时提交文档改动

## 目录结构

```bash
.
├── .changeset                        // 发布日志相关
├── docs                              // Kmi 文档站点
├── e2e                               // e2e
│   ├── hello-vue
│   ├── hello-react
│   └── *
├── examples                          // Kmi 演示及测试用例
│   ├── hello-tk                      // 具体的示例
│   ├── hello-krn
│   └── *
├── packages                          // 核心层
│   ├── shared                        // 工具库
│   ├── test-utils                    // 单侧工具库
│   ├── types                         // 类型包
│   └── *
├── plugins                           // Kmi 官方相关插件
│   ├── plugin-request
│   ├── plugin-flow-es                // 电商特有业务支持
│   ├── plugin-qianxiang              // 千象低代码支持
│   ├── plugin-dilu                   // dilu 微前端支持
│   ├── plugin-swet
│   └── *
├── presets                           // Kmi 官方预设
│   ├── preset-uni                    // 公共能力
│   ├── preset-react                  // react 框架支持
│   ├── preset-vue                    // vue 框架支持
│   ├── preset-ad                     // 商业化业务支持
│   ├── preset-es                     // 电商业务支持
│   ├── preset-flow                   // 工作流
│   └── *
├── scripts                           // 工程开发相关脚本及配置
│   └── *
├── solutions                         // 解决方案
│   ├── react                         // react 解决方案
│   ├── vue                           // vue 解决方案
│   ├── es                            // 电商解决方案
│   └── *
├── templates                         // 模版
├── ├── template-tk                   // tk 模版
├── ├── template-krn                  // krn 模版
├── ├── template-react                // react 模版
│   └── *
├── package.json                      // 应用依赖信息
├── tsconfig.json                     // ts 配置
└── vitest.workspace.ts               // 单侧配置
```

## 开发
### 安装依赖并构建
```shell
$ pnpm install
$ pnpm build
```
### 开发 Kmi

本地开发 Kmi 必开命令，用于编译 src 下的 TypeScript 文件到 dist 目录，同时监听文件变更，有变更时增量编译。
```shell
$ pnpm dev
```
如果觉得比较慢，也可以只跑特定 package 的 dev 命令，比如。

```shell
# 只启动 core
$ pnpm dev --filter @kmijs/core

# 只启动 preset-uni
$ pnpm dev --filter @kmijs/preset-uni
```

### 预打包三方包
在每个三方包下 我们的提供了命令 `build:deps` 用于预打包三方插件到本地, 可先在 package.json 配置三方包是否被预打包(更多请联系仁洪了解) 比如

```json
{
  "name": "@kmijs/bundler-shared",
  "compiledConfig": {
    "deps": [
      "tapable",
      "less",
      "express",
      + "http-proxy-middleware"
    ],
    "externals": {
      "tapable": "$$LOCAL",
      "less": "$$LOCAL"
    },
    "noMinify": [
      "./bundles/babel/bundle"
    ]
  }
}
```

#### 只执行单个包的预打包
```shell
$ pnpm build:deps --dep npm-package-arg
```

## 调试 cli 日志输出

```sh
DEBUG_CONSOLE=1 pnpm kmi xx
```

## 查看 Kmi 日志

安装 `pino-pretty`

```sh
pnpm add pino-pretty -g
```

在当前应用执行工作区执行 cat 查看执行日志

```sh
cat ./node_modules/.cache/logger/kmi.log | pino-pretty
```

还可以通过 [Kmi 日志查看平台](https://kmi-log-viewer.jinx.corp.kuaishou.com/) 进行日志查看筛选过滤

## 全局 Kmi 调试

```sh
# 切换到全局包
$ cd /solutions/g
# 软连到全局
$ pnpm link --global
```

取消全局软连

```sh
pnpm uninstall --global @kmijs/g
```

## 跨工作区调试

- 复制当前解决方案 bin 文件 比如 那 es 来举例 bin `your-project/solutions/es/bin/kmi.js`
- 执行命令

```sh
# 切换到你具体需要调试的项目
$ cd /your/debug-project
# 执行命令
$ your-project/solutions/es/bin/kmi.js build
```

## 构建性能分析

### Node.js Profiling

使用 Node.js 的 profiling 来分析 JS 侧的开销，这有助于发现 JS 侧的性能瓶颈。进行 [CPU profiling](https://nodejs.org/docs/v20.17.0/api/cli.html#--cpu-prof) 分析，在项目根目录执行以下命令

```sh
# dev  这里的 @kmijs/mreact 换成你所使用的集成包
node --cpu-prof ./node_modules/@kmijs/mreact/bin/kmi.js dev

# build
node --cpu-prof ./node_modules/@kmijs/mreact/bin/kmi.js build
```

以上命令执行后会生成一个 *.cpuprofile 文件，我们可以使用 [speedscope](https://github.com/jlfwong/speedscope) 来可视化查看该文件：

## Rspack profiling

Kmi 支持使用 `RSPACK_PROFILE` 环境变量来对 Rspack 进行构建性能分析

```sh
# dev
RSPACK_PROFILE=ALL kmi dev

# build
RSPACK_PROFILE=ALL kmi build
```

执行该命令后，会在产物目录下生成一个 `rspack-profile-${timestamp}` 文件夹，该文件夹下会包含 `logging.json`、`trace.json` 和 `jscpuprofile.json` 三个文件：

- `trace.json`：使用 tracing 细粒度地记录了 Rust 侧各个阶段的耗时，可以使用 [ui.perfetto.dev](https://ui.perfetto.dev/) 进行查看。
- `jscpuprofile.json`：使用 [Node.js inspector](https://nodejs.org/dist/latest-v18.x/docs/api/inspector.html) 细粒度地记录了 JavaScript 侧的各个阶段的耗时，可以使用 [speedscope.app](https://www.speedscope.app/) 进行查看。

## 贡献文档

文档是基于vitepress。

```sh
pnpm docs:dev
```

然后打开提示的端口号即可, 实时查看更新的文档内容

## 测试

### 单测

写好对应的单侧后执行 `pnpm test`

```sh
# 这里运行的是所有的单侧
pnpm test

# 执行单个单侧可以在命令后指定文件夹如
pnpm test /Users/xierenhong/work/x-dev/packages/babel-preset-vue/src/plugins/autoCSSModules.test.ts
```

### e2e

执行 `test:e2e` 和 `test:e2e:dev`
