- 为什么开发这个插件
- 插件功能介绍
- 开发历程

## 为什么开发这个插件

&ensp;&ensp;Mpx如今已是滴滴各团队开发小程序首选框架，很多公司在选择框架时也会把Mpx列入考量的范围中，且很多公司已经在生产环境中使用Mpx。其次vscode在前端领域用户众多，我也是其中之一，从刚开始从事前端工作使用的sublime,atom,webstorm,到最后vscode,选择它的理由可以是它的ui风格，它的免费，它的启动速度，它的插件，它的大厂背书，它强大的社区，以至于它如此的火爆。

&ensp;&ensp;刚加入滴滴时，有幸加入Mpx框架的开发团队，在学习Mpx的时候，在ide配置这里，看文档就觉得配置并不容易，需要让.mpx后缀文件通过vue文件识别，然后下载```vetur```配置一些prettier，下载```Auto Close Tag```让标签闭合，下载```wechat-snippet```使用wx.xxx的snippets等等

&ensp;&ensp;所以基于此现状萌生了搞这个插件的想法，最初的想法弄个高亮，快速的学习了插件如何写，怎么发布上传，然后看了下vue插件的高亮实现，copy过来同样可以适用Mpx，这样vscode-mpx的初版就是一个提供高亮语法且能识别.mpx后缀文件的插件。

&ensp;&ensp;实现了第一版本的插件就迫不及待的跟社群里的开发者分享，立马就得到了几个开发者的反馈，包括“为什么没有跳转定义？”“好像也不能配置prettier”，后续也随着迭代增加了这些功能，下载量也得到提升，这样一次次的正反馈，更加让我有动力去搞这件事。

## 插件功能介绍

- 格式化
- 高亮
- emmet
- 跳转定义
- 自动补全
- eslint

[视频介绍](https://gift-static.hongyibo.com.cn/static/kfpub/3227/vscodes.mp4)


### 高亮

&ensp;&ensp;与其他语言插件无异，提供相应代码的高亮，因为Mpx分为四个模块，所以每个模块都有相应的语法高亮，还包括注释快捷键，也区分了相应模块，比如`<template>`中使用的是html的高亮，且注释是`<!-- -->`,而`<script>`中就是`js`的高亮，注释是`//`

![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/QQ20210728-0.png)

### emmet

&ensp;&ensp;早在使用sublime时就在使用emmet插件，以提高写HTML的效率。

&ensp;&ensp;比如键入多个`<view>`标签：`view*n`。

&ensp;&ensp;比如一些标签的快速键入，配合`tab`或者`Enter`键快速键入

&ensp;&ensp;不仅仅是`<template>`模块，css，scss，less，stylus，sass模块也有相应的快捷指令

![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/QQ20210728-200258.gif)
![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/QQ20210728-200331.gif)


提示组件标签

我们可以像编写 html 一样，只要输入对应的单词就会出现对应的标签，比如输入的是 view ，然后按下 tab 键，即可输入 `<view></view>` 标签。

<img src="https://gift-static.hongyibo.com.cn/static/kfpub/3547/tishi1.png" width="500" alt="图片名称" />

组件指令提示

指令的提示类似于 vue 文件一样，只要输入对应的指令前缀就会出现对应的完整指令，比如输入的是 wx ，然后按下 tab 键，就可以输入 wx:if="" 指令。
<img src="https://gift-static.hongyibo.com.cn/static/kfpub/3547/tishi2.png" width="500" alt="图片名称" />

组件属性提示

微信小程序的每个组件都有一些属性选项，在编写组件的时候输入前缀就会出现完整的属性，并且包含了属性的说明和属性的类型。
<img src="https://gift-static.hongyibo.com.cn/static/kfpub/3547/tishi3.png" width="500" alt="图片名称" />

组件事件提示

给组件绑定事件，也是只需要输入事件的前缀，就会出现完整的事件列表，然后按下 tab 键，即可输入 bindtap="" 类似的事件。
<img src="https://gift-static.hongyibo.com.cn/static/kfpub/3547/tishi4.png" width="500" alt="图片名称" />

### 跳转定义

&ensp;&ensp;command + 鼠标左键 查看定义位置，也可以在当前文件查看内容，决定是否跳转

![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/QQ20210728-200848.gif)

### 自动补全

&ensp;&ensp;毕竟Mpx是个小程序的框架，对于微信和支付宝的api快速补全snippets没有怎么能行，可在`<script>`中通过键入部分文字插入相应的代码块

![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/QQ20210728-201858.gif)

### eslint

&ensp;&ensp;eslint这块要分两部分来讲，一部分是插件实现了按照模块区分的简单的eslint，另一部分是要配合eslint的vscode插件，配置.eslintrc高阶的eslint检测。

部分一可通过配置开关

`<template>`是通过我们自己实现的eslint插件`eslint-plugin-mpx`，通过调eslint提供的引擎api，返回eslint校验的结果，我们再进行展示。

`<script>`中是通过调用typescript提供的检测js代码的api来进行检测，返回
的校验结果也是不太符合语法的，基础的检测，不会过于苛刻

`<style>`中会根据lang的设定进行相应的检测，此检测是vscode官方提供的库
`vscode-css-languageservice`

`<json>`模块同tempalte，用到了一个eslint插件`eslint-plugin-jsonc`来检测json的部分

![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/QQ20210728-202133@2x.png)

部分二可参照此[链接](https://github.com/mpx-ecology/vscode-mpx/issues/35)配置

### 代码格式化

支持代码格式化 JavaScript  (ts)· JSON · CSS (less/scss/stylus) · WXML，通过鼠标右键选择代码格式化文档。

![image](https://gift-static.hongyibo.com.cn/static/kfpub/3547/format.png)

默认每个区块都是调用 Prettier 这个库来完成格式化的，当然也可以在设置中切换成使用其他库。

![image](https://gift-static.hongyibo.com.cn/static/kfpub/3547/format2.png)

如果切换成 none 将会禁用格式化。

Prettier 支持从项目根目录读取 .prettierrc 配置文件。配置选项可以参考 [官方](https://prettier.io/docs/en/configuration.html) 文档。.prettierrc 文件可以使用 JSON 语法编写，比如下面这样：

```
{
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

注意：由于 Prettier 这个库不支持格式化 stylus 语法，所以 stylus 的格式化使用另外一个 stylus-supremacy 库，配置 stylus 格式化规则只能在编辑器的 settings 中配置。
```
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
总结一下，配置格式化有两种方式，一种是使用 .prettierrc 文件的形式配置，另一种是在编辑器的 settings 中自行配置，通过 mpx.format.defaultFormatterOptions 选项。



## 开发历程

&ensp;&ensp;插件仓库最初由我建立，后面加入吴贤强同学，完成了格式化，json模块等等的开发，谢志鹏同学完成了ts相关的开发,让我们的插件的进度得以发展迅速，感谢小伙伴的努力。

### 项目框架
![image](https://gift-static.hongyibo.com.cn/static/kfpub/6168/tre.png)
项目整体基于语言服务器协议（LSP），语言服务器协议采用JSON-RPC作为最基本的消息格式。我们在serve层实现我们的功能，通过client端来调用。vscode提供LSP的库更加便于我们实现给予协议的接口，在服务层处理这些复杂的交互相比端来处理更具有优势。

期间的确遇到了很多问题，比如

### 打包问题

&ensp;&ensp;由于我们借鉴了vetur的实现，沿用了它的打包方式，打包后的大小大概有40多m左右，虽说对于插件来说还是能接受，毕竟不同于web，这个算是应用，下载一次就ok了，但是还是希望力求完美，尝试了用webpack去打包，terser压缩，发现了问题。

&ensp;&ensp;因为有些需要动态引入的包，导致webpack在收集依赖的时候不确定用户真正需要的库是什么，比如eslint，不确定引入的插件包是什么或者用户定义的规则库，eslint内部实现是动态的引入这些库

&ensp;&ensp;vetur的做法是直接把node_modules以及业务代码直接通过vscode的打包工具打包,它会先执行`npm run prod`
完全依赖库自己的prod，然后最近更新了的是用rollup来打包压缩业务代码，node_modules依旧是之前的处理方式

### 图标问题

&ensp;&ensp;对于vscode插件，vscode官方只针对一些热门的语言配置了默认的图标，并且有一个仓库专门来维护这些图标[【seti-ui】](https://github.com/jesseweed/seti-ui),如果你要写一套图标主题的插件，那么也就可以参照这个图标库，设计自己的图标风格。由于我们不够热门，不幸的是他们并不愿意添加我们的图标，所以最后我选择了一种并不算好的hack方式，我clone了这个仓库添加了我们的图标，新创建了一个主题，所以如果用户不用我的主题，则在其他主题看不到我们的文件图标展示，会展示成文件默认的图标，这个算是vscode没有考虑一些新的DSL语言拓展的问题，vscode仓库issue下也探讨了许多，后续有人更改我们也会持续改进。

### Eslint

&ensp;&ensp;可能你们认为Eslint只作用于js，对于其他语言并不起作用，最早的`jslint`和`jshint`的确是这样，但是随着Eslint的出现，实现了parser的可配置，配置相应的parser就可以针对文本生成相应的AST,再遍历AST来判断是否有错误，产生可描述的错误日志抛给程序员。

&ensp;&ensp;Eslint这部分刚才提到两个部分，这里着重讲下第二个部分，几个问题

1. eslint插件如何识别.mpx文件
2. eslint主要作用哪些模块
3. eslint工作流程是怎样的，或者说怎么work在Mpx中的

第一个问题，在vscode的settings.json中加入
```
"eslint.validate": [
    "mpx",
],
```
这样eslint的插件就能根据languageId=mpx的文件识别到.mpx文件，还需要下载Mpx的vscode插件，因为它赋予了.mpx文件languageId为mpx

第二个问题

eslint主要作用于javascript模块和template模块

第三个问题

首先eslint会拿到我们的文本内容，用`mpx-eslint-parser`这个parser解析，然后找到javascript模块和template模块，会先对javascript模块进行解析，用的是eslint默认用的解析器`espree`,然后`espree`执行完成的最后一个钩子中，再去解析template模版，用的是`mpx-eslint-parser`中实现的对template的一个解析。

### 格式化

关于格式化的实现原理介绍：目前比较流行的格式化库有 Prettier，但是把完整的 Mpx 文件代码传给 Prettier 是无法直接格式化的，我们需要分区块进行格式化，也就是把 `<template>` `<script>` `<style>` 每个部分里面的内容分别传给 Prettier 去处理。在提取每个区块的时候，会把其他的区块内容全部转换为空格，因为我们在格式化的时候，要保证每个区块的位置不发生变化，只是里面的内容发生变化。

## 最后

&ensp;&ensp;插件确实还有很多细节需要打磨，也欢迎大家提优化改进的需求，我们都会及时满足和修复。在实现的过程中也了解到了很多关于vscode插件，eslint相关的内容，如果你也在实现插件，有问题我们也可以探讨。最后的最后，还请大家多多尝试插件，尝试使用Mpx开发小程序。