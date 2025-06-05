
# html 配置

下面的配置用于自定义 html 模版

## favicons

- **类型**：`string[]`
- **默认值**： `null`

支持配置多个 favicon 文件。配置 favicons 路径，可以是绝对路径，也可以是基于项目根目录的相对路径。

示例：

```ts [config/config.ts]
export default defineConfig({
  favicons: ['/favicon.ico'] // [!code ++]
})
```

会生成以下 html

```html [dist/index.html]
  <head>
    <link rel="shortcut icon" href="/favicon.ico" /> <!-- [!code ++] -->
```

## headScripts

- **类型**：`string[] | Script[]`
- **默认值**：`[]`

配置 `<head>` 中的额外 script。

### value 为字符串
当 headScripts 对象的 value 为`字符串`时, 会自动区分配置支持内联样式和外联样式路径 后者通过是否以 `https?://` 开头来判断

示例
```ts [config/config.ts]
export default defineConfig({
  headScripts: [
    // 内联脚本
    `console.log('hello kmi')`, // [!code ++]
    // 外联脚本
    `https://a.com/b.js` // [!code ++]
  ]
})
```
最终会生成以下 HTML，

```html [dist/index.html]
<head>
  <script>
    alert(1)
  </script>
  <script src="https://a.com/b.js"></script>
</head>
```

### value 为对象

* **类型**

```ts
type Script = {
  // 外联脚本
  src?: string;
  // 内联脚本
  content?: string:
  // 额外的属性
  [attrScriptName]?: any
};
```

如果需要额外属性，切换到对象格式，比如，

```ts [config/config.ts]
export default defineConfig({
  headScripts: [
    // 外联脚本
    { src: '/foo.js', defer: true }, // [!code ++]
    // 内联脚本
    { content: `alert('你好');`, charset: 'utf-8' } // [!code ++]
  ]
})
```

最终会生成以下 HTML，

```html [dist/index.html] {2-5}
<head>
  <script src="/foo.js" defer></script>
  <script charset="utf-8">
    alert('你好');
  </script>
</head>
```

## links

* **类型**：`Link[]`
* **默认值**：`[]`

配置额外的 link 标签。 通过数组对象的形式, 会将该对象的 key: value 映射为 link 标签的属性 link 属性详见 [mdn link](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)

### 示例: 添加一个预加载样式

```js
links: [{ href: '/foo.css', rel: 'preload' }]
```

```ts [config/config.ts]
import { defineConfig } from '@kmi/kmijs'

export default defineConfig({
  links: [{ href: '/foo.css', rel: 'preload' }]  // [!code ++]
})
```
最终在 HTML 中生成的 link 标签为：

```html [dist/index.html]
<link href="/foo.css" rel="preload">
```
### 示例: 添加一个 icon

```ts [config/config.ts]
export default defineConfig({
  links: [{ rel: 'apple-touch-icon', size: '180x180', href: '/apple-touch-icon-180x180.png' }]  // [!code ++]
})
```

最终在 HTML 中生成的 link 标签为：

```html [dist/index.html]
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
```

## metas

* **类型**：`Object | Array`
* **默认值**：

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge"
```

配置额外的 meta 标签。 meta 属性详见 [mdn meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#http-equiv)

### Object 类型 <Badge type="tip" text="^2.0.0" />

<ApiMeta addedVersion="2.0.0" />
Kmi 2.0 支持以对象的形式配置 meta 标签

```ts
export type MetaOptions = {
  /**
   * name content pair
   * e.g. { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' }`
   * */
  [name: string]: string | MetaAttrs;
};
```
#### value 为字符串 <Badge type="tip" text="^2.0.0" />

* **类型**：
```ts
type MetaOptions = {
  [name: string]: string;
};
```
当 metas 对象的 value 为字符串时，会自动将对象的 key 映射为 name，value 映射为 content。


比如设置 description：
```ts [config/config.ts]
import { defineConfig } from '@kmi/kmijs'

export default defineConfig({
  metas: {
    description: 'a description of the page', // [!code ++]
  },
})
```
最终在 HTML 中生成的 meta 标签为：

```html [dist/index.html]
<meta name="description" content="a description of the page" />
```

#### value 为对象 <Badge type="tip" text="^2.0.0" />

* **类型**：
```ts
type MetaAttrs = { [attrName: string]: string | boolean };
type MetaOptions = {
  [name: string]: MetaAttrs;
};
```
当 metas 对象的 value 为对象时，会将该对象的 key: value 映射为 meta 标签的属性。

比如配置配置 X-UA-Compatible

```ts [config/config.ts]
import { defineConfig } from '@kmi/kmijs'

export default defineConfig({
  metas: {
    'X-UA-Compatible': { // [!code ++]
      'http-equiv': 'X-UA-Compatible', // [!code ++]
      content: 'IE=Edge,chrome=1',  // [!code ++]
    }  // [!code ++]
  }
})
```
最终在 HTML 中生成的 meta 标签为：

```html [dist/index.html]
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
```

### Array 类型

* **类型**：

```ts
type Metas = Array<HTMLMetaElement>
```

通过数组对象的形式, 会将该对象的 key: value 映射为 meta 标签的属性。更多属性详见详见 [mdn meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta#http-equiv)

示例：

```ts [config/config.ts]
import { defineConfig } from '@kmi/kmijs'

export default defineConfig({
  metas: [
    { name: 'keywords', content: 'kmi, kmijs' }, // [!code ++]
    { name: 'description', content: 'React framework.' } // [!code ++]
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge,chrome=1' }  // [!code ++]
  ]
})
```

最终在 HTML 中生成的 meta 标签为

```html [dist/index.html]
<meta name="keywords" content="kmi, kmis" />
<meta name="description" content="React framework." />
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
```

### 覆盖默认值 <Badge type="tip" text="^2.0.0" />

当配置了 HTML 模版中已经包含了的 charset、viewport、http-equiv、 meta 标签时, 那么用户的标签优先级最高、可通过这个特性来覆盖默认配置

比如覆盖默认的 viewport

eg.

```ts [config/config.ts]
export default defineConfig({
  metas: {
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.5, minimum-scale=0.9, user-scalable=yes'  // [!code ++]
  }
})
```

```html [dist/index.html]
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.5, minimum-scale=0.9, user-scalable=yes" />
```

### 移除默认值 <Badge type="tip" text="^2.0.0" />

将 `metas` 对象的 `value` 设置为 `false`，则表示不生成对应的 meta 标签。

比如移除 Kmi 预设的 `viewport`：

eg.

```ts [config/config.ts]
export default defineConfig({
  metas: {
    viewport: false  // [!code ++]
  }
})
```

## mountElementId

* **类型**：`string`
* **默认值**：`root`

默认情况下，HTML 模板中包含了 root 节点用于组件挂载，通过 mountElementId 可以修改该节点的 id。

示例

修改 DOM 挂载节点 id 为 `app`：

```ts [config/config.ts]
export default defineConfig({
  mountElementId: 'app' // [!code ++]
})
```

最终在 HTML 中生成的 meta 标签为

```html [dist/index.html]
<body>
  <div id="app"></div> // [!code warning]
</body>
```

## scripts

- **类型**：`string[] | Script[]`
- **默认值**：`[]`

配置 `<body>` 中的额外 script。

### value 为字符串
当 scripts 对象的 value 为`字符串`时, 会自动区分配置支持内联样式和外联样式路径 后者通过是否以 `https?://` 开头来判断

示例
```ts [config/config.ts]
export default defineConfig({
  scripts: [
    // 内敛脚本
    `console.log('hello kmi')`, // [!code ++]
    // 外联脚本
    `https://a.com/b.js` // [!code ++]
  ]
})
```
最终会生成以下 HTML，

```html [dist/index.html]
<body>
  <script>
    alert(1)
  </script>
  <script src="https://a.com/b.js"></script>
</body>
```

### value 为对象

* **类型**

```ts
type Script = {
  // 外联脚本
  src?: string;
  // 内敛脚本
  content?: string:
  // 额外的属性
  [attrScriptName]?: any
};
```

如果需要额外属性，切换到对象格式，比如，

```ts [config/config.ts]
export default defineConfig({
  scripts: [
    // 外联脚本
    { src: '/foo.js', defer: true }, // [!code ++]
    // 内敛脚本
    { content: `alert('你好');`, charset: 'utf-8' } // [!code ++]
  ]
})
```

最终会生成以下 HTML


```html [dist/index.html] {2-5}
<body>
  <script src="/foo.js" defer=""></script>
  <script charset="utf-8">
    alert('你好');
  </script>
</body>
```

## styles
* **类型**：`string[] | Style[]`
* **默认值**：`[]`

配置额外的 CSS。插入的样式会前置，优先级低于项目内用户编写样式。

### value 为字符串

当 styles 对象的 value 为`字符串`时, 会自动区分配置支持内联样式和外联样式路径 后者通过是否以 `https?://` 开头来判断

示例：
```ts [config/config.ts]
export default defineConfig({
  styles: [
    // 插入内联样式
    `body { color: red; }`, // [!code ++]
    // 插入外联样式
    `https://a.com/b.css` // [!code ++]
  ]
})
```

最终会生成以下 HTML，

```html [dist/index.html]
<style>
  body {
    color: red;
  }
</style>
<link rel="stylesheet" href="https://a.com/b.css" />
```

### value 为对象

* **类型**：

```ts
type Style = {
  // 外联样式
  src?: string;
  // 内敛样式
  content?: string:
  // 额外的属性
  [attrStyleName]?: any
};
```
当需要配置额外的属性时，可以使用对象形式。例如

```ts [config/config.ts]
export default defineConfig({
  styles: [
    {
      // 外联样式
      src: 'https://a.com/b.css',
      // 添加额外属性
      crossorigin: 'anonymous', // [!code ++]
      media: 'screen and (min-width: 900px)' // [!code ++]
    },
    {
      // 内联样式
      content: 'body { color: red }',
      // 添加额外属性
      media: 'print',
      'data-kmi': true
    }
  ]
})
```

最终会生成以下 HTML:

```html [dist/index.html]
<link
  rel="stylesheet"
  href="https://a.com/b.css"
  crossorigin="anonymous"
  media="screen and (min-width: 900px" />
<style media="print" data-kmi>
  body {
    color: red;
  }
</style>
```

## title
- **类型**：`string`
- **默认值**：`null`

配置全局页面 title，暂时只支持静态的 Title。

示例：

```ts [config/config.ts]
export default defineConfig({
  title: "磁力引擎" // [!code ++]
})
```
