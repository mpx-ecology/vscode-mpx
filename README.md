<p>
  <h1 align="center">vscode-mpx</h1>
</p>

## 📖 Usage

### 格式化
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

```
"mpx.completion.scaffoldSnippetSources": {
  "workspace": "💼", // Suffix workspace snippets with `💼`
  "user": "(️User)", // Suffix workspace snippets with `(User)`
  "mpx": "" // Disable Mpx's builtin scaffold snippets
}
```
### 小程序指令&API
尝试在标签内输入小程序指令和API
> `<view wx:`

> `mpx.navigateTo`
### eslint

在`settings`中可开关响应模块的eslint检查



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
