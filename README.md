<p>
  <h1 align="center">vscode-mpx</h1>
</p>

## 📖 Usage

### 格式化

vscode-mpx 支持代码格式化 JavaScript · TypeScript · JSON · CSS · SCSS · Less · Wxml  

格式化依赖第三方的包来完成:

> [`prettier`](https://github.com/prettier/prettier): 用来格式化 css/scss/less/js/ts/json/wxml.

> [`prettier-eslint`](https://github.com/prettier/prettier-eslint): 用来格式化 js.

> [`stylus-supremacy`](https://github.com/ThisIsManta/stylus-supremacy): 用来 stylus.

> [`vscode-typescript`](https://github.com/Microsoft/TypeScript): 用来格式化 js/ts. 

您可以在VSCode配置中选择每种语言的默认格式化选项。设置 `mpx.format.defaultFormatter`

**将语言的格式化选项设置为“none”将禁用该语言格式化代码**

当前默认值:

```js
  {
    "mpx.format.defaultFormatter.html": "prettier",
    "mpx.format.defaultFormatter.css": "prettier",
    "mpx.format.defaultFormatter.scss": "prettier",
    "mpx.format.defaultFormatter.less": "prettier",
    "mpx.format.defaultFormatter.stylus": "stylus-supremacy",
    "mpx.format.defaultFormatter.js": "prettier",
    "mpx.format.defaultFormatter.ts": "prettier",
    "mpx.format.defaultFormatter.json": "prettier"
  }
```
格式化设置，打开编辑器的 settings 进行配置。设置 `mpx.format.defaultFormatterOptions` 选项。

当前默认值:

```js
"mpx.format.defaultFormatterOptions": {
    "prettyhtml": {
        "printWidth": 100,
        "singleQuote": false,
        "wrapAttributes": false,
        "sortAttributes": false
    },
    "prettier": {
        "printWidth": 100,
        "singleQuote": true,
        "wrapAttributes": false,
        "sortAttributes": false,
        "semi": false,
        "insertSpaceBeforeFunctionParenthesis": true
    },
    "stylus-supremacy": {
        "insertColons": false,
        "insertSemicolons": false,
        "insertBraces": false,
        "insertNewLineAroundImports": true,
        "insertNewLineAroundBlocks": false
    }
}
```

1、可以设置 Wxml 格式化选项:
```js
"mpx.format.defaultFormatterOptions": {
  "prettyhtml": {
    "printWidth": 100, // 1行不超过100个字符
    "singleQuote": false, // 不使用单引号
    "wrapAttributes": false, // 属性不换行
    "sortAttributes": false // 属性不排序
  }
}
```

2、可以设置 JS 格式化选项:
```js
"mpx.format.defaultFormatterOptions": {
  "prettier": {
    "printWidth": 100, // 1行不超过100个字符
    "singleQuote": true, // 使用单引号
    "wrapAttributes": false, // 属性不换行
    "sortAttributes": false, // 属性不排序
    "semi": false, // 不使用分号结尾
    "insertSpaceBeforeFunctionParenthesis": true // 函数括号前插入空格
  }
}
```

3、可以设置 stylus 格式化选项:
```js
"mpx.format.defaultFormatterOptions": {
  "stylus-supremacy": {
    "insertColons": false, // 不使用括号
    "insertSemicolons": false, // 不使用冒号
    "insertBraces": false, // 不使用分号
    "insertNewLineAroundImports": true, // import之后插入空行
    "insertNewLineAroundBlocks": false // 每个块不添加空行
  }
}
```

### snippets
尝试输入以下字符快速生成代码块

分为四大类，分别是：`script`,`style`,`template`,`default`
>`app`,`component`,`javascript`,`page` // script

>`css-scoped`,`css`,`less-scoped`,`less`,`postcss-scoped`,`postcss`,`sass-scoped`,`sass`,`scss-scoped`,`scss`,`stylus-scoped`,`stylus` // style

>`html`,`pug` // template

除了mpx提供的snippets外，用户还可以自定义snippets

>💼工作区。位于<WORKSPACE>/.vscode/mpx/snippets。这些脚手架片段仅在工作空间中可用。

>User️用户数据目录。您可以使用命令打开文件夹Mpx: Open user scaffold snippet folder。这些脚手架片段可在所有工作空间中使用。

>✌Mpx。Mpx提供了一些现成的脚手架片段。

脚手架片段的完成情况按其类别进行排序。工作区>用户> Mpx

您可以使用以下命令自定义后缀并打开/关闭源mpx.completion.scaffoldSnippetSources

```js
"mpx.completion.scaffoldSnippetSources": {
  "workspace": "💼", // Suffix workspace snippets with `💼`
  "user": "(️User)", // Suffix workspace snippets with `(User)`
  "mpx": "" // Disable Mpx's builtin scaffold snippets
}
```
### 小程序指令&API
尝试在标签内输入小程序指令和API
> `<view wx:` // template

> `mpx.navigateTo` // script
### eslint

在`settings`中可开关响应模块的eslint检查

相关规则文档进行中～

### 跳转定义

`command` + `鼠标左键` 查看定义位置

### Emmet

Emmet支持可用于html，css，scss，less，stylus，sass，而无需对VS Code 1.15.0+进行任何配置。

## 贡献
如果有兴趣完成上面的某个功能，欢迎👏提交pr，已经需要提供什么样的功能在issue里提交即可

## 开发

```shell
    yarn
    cd server yarn
    // note: vscode界面  cmd + shift + b 快速启动
```

## 声明

站在巨人肩膀上
[stand by vetur](https://github.com/vuejs/vetur)
