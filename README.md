
<p>
  <h1 align="center">vscode-mpx</h1>
</p>

## Snippets

插件的 Snippets 如下表格所示，比如你可以键入 `w` 然后按上下键选中 `wx:if` 再按Enter键，就输入了`wx:if=""`了。

<br />

| Prefix | directives Snippet Content |
| ------ | ------------ |
| `wx:if` | `wx:if=""` |
| `wx:else` | `wx:else` |
| `wx:elif` | `wx:elif=""` |
| `wx:for` | `wx:for=""` |
| `wx:for-item` | `wx:for-item=""` |
| `wx:for-index` | `wx:for-index=""` |
| `wx:key` | `wx:key=""` |


<br />

| Prefix | WXML Snippet Content |
| ------ | ------------ |
| `coverImage` | `<cover-image></cover-image>`|
| `coverView` | `<cover-view></cover-view>`|
| `matchMedia` | `<match-media></match-media>`|
| `movableArea` | `<movable-area></movable-area`|
| `movableView` | `<movable-view></movable-view`|
| `scrollView` | `<scroll-view></scroll-view`|
| `swiper` | `<swiper></swiper>`|
| `swiperItem` | `<swiper-item></swiper-item>`|
| `view` | `<view></view>`|
| `icon` | `<icon></icon>`|
| `progress` | `<progress></progress>`|
| `richText` | `<rich-text></rich-text>`|
| `text` | `<text></text>`|
| `button` | `<button></button>`|
| `checkbox` | `<checkbox></checkbox>`|
| `checkboxGroup` | `<checkbox-group></checkbox-group>`|
| `editor` | `<editor></editor>`|
| `form` | `<form></form>`|
| `input` | `<input></input>`|
| `label` | `<label></label>`|
| `picker` | `<picker></picker>`|
| `pickerView` | `<picker-view></picker-view>`|
| `pickerViewColumn` | `<picker-view-column></picker-view-column>`|
| `radio` | `<radio></radio>`|
| `radio-group` | `<radio-group></radio-group>`|
| `slider` | `<slider></slider>`|
| `switch` | `<switch></switch>`|
| `functionalPageNavigator` | `<functional-page-navigator></functional-page-navigator>`|
| `navigator` | `<navigator></navigator>`|
| `audio` | `<audio></audio>`|
| `camera` | `<camera></camera>`|
| `image` | `<image></image>`|
| `livePlayer` | `<live-player></live-player>`|
| `livePusher` | `<live-pusher></live-pusher>`|
| `video` | `<video></video>`|
| `voip-room` | `<voip-room></voip-room>`|
| `map` | `<map></map>`|
| `canvas` | `<canvas></canvas>`|
| `ad` | `<ad></ad>`|
| `officialAccount` | `<official-account></official-account>`|
| `openData` | `<open-data></open-data>`|
| `webView` | `<web-view></web-view>`|
| `navigationBar"` | `<navigation-bar"></navigation-bar">`|
| `pageMeta` | `<page-meta></page-meta>`|
| `progress` | `<progress></progress>`|

<br />

## 格式化

vscode-mpx 支持代码格式化 `html/css/scss/less/postcss/stylus/js/ts/json`.

**vscode-mpx只能右键选择格式化代码，不能选中部分代码进行格式化.**  


格式化依赖第三方的包来完成:

- [`prettier`](https://github.com/prettier/prettier): 用来格式化 css/scss/less/js/ts.
- [`prettier-eslint`](https://github.com/prettier/prettier-eslint): 用来格式化 js.
- [`prettyhtml`](https://github.com/Prettyhtml/prettyhtml): 用来格式化 html.
- [`stylus-supremacy`](https://github.com/ThisIsManta/stylus-supremacy): 用来 stylus.
- [`vscode-typescript`](https://github.com/Microsoft/TypeScript): 用来格式化 js/ts. 

您可以在VSCode配置中选择每种语言的默认格式化选项 `mpx.format.defaultFormatter`.

**将语言的格式化选项设置为“none”将禁用该语言格式化代码**

当前默认值:

```json
{
  "mpx.format.defaultFormatter.html": "prettyhtml",
  "mpx.format.defaultFormatter.css": "prettier",
  "mpx.format.defaultFormatter.postcss": "prettier",
  "mpx.format.defaultFormatter.scss": "prettier",
  "mpx.format.defaultFormatter.less": "prettier",
  "mpx.format.defaultFormatter.stylus": "stylus-supremacy",
  "mpx.format.defaultFormatter.js": "prettier",
  "mpx.format.defaultFormatter.ts": "prettier",
  "mpx.format.defaultFormatter.json": "prettier"
}
```

格式化设置，打开编辑器的 settings 进行配置。

可以设置格式化的缩进选项:

```json
{
  "mpx.format.options.tabSize": 2,
  "mpx.format.options.useTabs": false
}
```

可以设置 html 格式化选项:
```json
"mpx.format.defaultFormatterOptions": {
  "prettyhtml": {
    "printWidth": 100, // 1行不超过100个字符
    "singleQuote": false // 是单引号还是双引号
  }
}
```

可以设置 stylus 格式化选项:
```json
{
  "stylusSupremacy.insertBraces": false, // 不使用括号
  "stylusSupremacy.insertColons": false, // 不使用冒号
  "stylusSupremacy.insertSemicolons": false // 不使用分号
}
```

## 代码校验

vscode-mpx 提供了错误检查代码校验。

vscode-mpx 错误检查支持的语法:

- `<template>`: `html`
- `<style>`: `css`, `scss`, `less`
- `<script>`: `js`, `ts`, `json`

您可以通过以下方式选择性地关闭错误检查 `mpx.validation.[template/style/script]`.


需要安装 [ESLint 插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) 可以定制化配置自己的 JS 校验规则. Mpx 的 template 部分都已经内置了校验规则，不支持规则配置.


校验 `<template>` 部分 vscode-mpx 使用 [`eslint-plugin-mpx`](https://github.com/pagnkelly/eslint-plugin-mpx) . 里面包含一些必要的 essential [规则](https://github.com/pagnkelly/eslint-plugin-mpx/blob/master/lib/configs/essential.js)

校验 `<script type="application/json">` 部分 vscode-mpx 使用 [`eslint-plugin-jsonc`](https://github.com/ota-meshi/eslint-plugin-jsonc) . 里面包含一些推荐的 recommended-with-json [规则](https://ota-meshi.github.io/eslint-plugin-jsonc/rules/)
