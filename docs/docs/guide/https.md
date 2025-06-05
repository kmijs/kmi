# 使用 HTTPS 进行本地开发

大多数情况下，`http://localhost` 的行为与 HTTPS 类似，可用于开发目的。不过，在某些特殊情况下（例如使用自定义主机名或跨浏览器使用安全 Cookie），您需要明确将开发网站设置为像 HTTPS 一样运行

## 使用 mkcert 在本地通过 HTTPS 运行您的网站 <Badge type="tip" text="推荐" />

[mkcert](https://github.com/FiloSottile/mkcert) 是一个用于制作本地受信任开发证书的简单工具。它不需要任何配置。

### 安装 mkcert (只需安装一次) {#mkcert}

按照说明在您的操作系统上安装 mkcert

::: code-group

```sh [macOS]
brew install mkcert
brew install nss # if you use Firefox
```

```sh [Linux]
# 在 Linux 上，首先安装 certutil：
sudo apt install libnss3-tools
    # or
sudo yum install nss-tools
    # or
sudo pacman -S nss
    # or
sudo zypper install mozilla-nss-tools

# 然后您可以使用 Linux 版 Homebrew 安装：
brew install mkcert
```

```sh [Windows]
# On Windows, use [Chocolatey](https://chocolatey.org)
choco install mkcert

# or use Scoop
scoop bucket add extras
scoop install mkcert
```
:::

或从源代码构建（需要 Go 1.10+），或使用 [预构建的二进制文件](https://github.com/FiloSottile/mkcert/releases).
如果遇到权限问题，请尝试以管理员身份运行 `mkcert`

### 将 mkcert 添加到您的本地根 CA

在终端中，运行以下命令

```sh
mkcert -install
```

::: warning
切勿导出或共享 mkcert 在您运行 `mkcert -install` 时自动创建的 `rootCA-key.pem` 文件。如果攻击者掌握了此文件，则可以对您可能访问的任何网站发起路径攻击。他们可能会拦截您机器发送到任何网站（例如银行、医疗保健提供方或社交网络）的安全请求。如果您需要知道 `rootCA-key.pem` 的位置以确保其安全无虞，请运行 `mkcert -CAROOT`。
:::

这会生成一个本地证书授权机构 (CA)。使用 mkcert 生成的本地 CA 仅在设备上本地受信任。

## 项目配置

```ts [config/config.ts]
export default defineConfig({
  // 启用
  https: {} // [!code ++]
})
```

如果安装了 `mkcert` 它会通过 `mkcert` 自动创建一个自签名的证书, 如果未安装 `mkcert` 会通过 `selfsigned` 生成自签名证书,
::: tip
这里需要注意的是 `selfsigned` 生成的自签名证书不受信任, 需要手动确认后即可访问 HTTPS 页面
:::

你以可以 手动传入 HTTPS 服务器所需要的证书和对应的私钥

```ts [config/config.ts]
export default defineConfig({
  https: {
    key: fs.readFileSync('certificates/private.pem'),
    cert: fs.readFileSync('certificates/public.pem'),
  }
})
```
