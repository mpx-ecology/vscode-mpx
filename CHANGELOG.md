# Change Log

## All notable changes to the "vscode-mpx" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.


### 0.2.1 | 2021-04-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.1/vspackage)

- 优化wxapi
- 增加使用文档

### 0.1.22 | 2021-03-29 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.22/vspackage)

- 增加json模块eslint
- 解决多script标签检查bug

### 0.1.21 | 2020-11-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.21/vspackage)

- 移除eslint规则`mpx/no-deprecated-html-element-is`
- 升级typescript版本@4.1.0-beta

### 0.1.20 | 2020-10-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.20/vspackage)

- 修复eslint wx:elif错误提示

### 0.1.19 | 2020-10-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.19/vspackage)

- 下掉eslint - wx:for检测 wx:key没有兼容好
- 下掉eslint-plugin-mpx中`mpx/no-multiple-template-root`, 但仍然不建议在一个template下多个根节点

### 0.1.18 | 2020-10-21 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.18/vspackage)

- 打开eslint对于template的检查，进行一些简单的检查，如不需要可在settings中关闭相应模块的检查

### 0.1.17 | 2020-10-20 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.17/vspackage)

- 修复<script lang="ts">eslint错误

### 0.1.16 | 2020-09-10 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.16/vspackage)

- 修复高亮与vetur冲突

### 0.1.15 | 2020-09-03 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.15/vspackage)

- 增加format功能

### 0.1.14 | 2020-08-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.14/vspackage)

- 增加js模块的lint
- 增加template的补全标签属性

### 0.1.13 | 2020-07-26 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.13/vspackage)

- 修复bug
- 增加wxapi，可以在`<script>`里通过mpx.xxx查看wxapi

### 0.1.11 | 2020-07-13 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.11/vspackage)

- 因存在无法解决问题，移除weppack，体积增大了
- 增加snippets语法,可以尝试输入`mpx`查看相关代码块

### 0.1.2 | 2019-12-17 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.2/vspackage)

- 增加webpack优化包体积，下载更快

### 0.1.1 | 2019-12-16 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.1/vspackage)

- 修复与vetur冲突

### 0.1.0 | 2019-12-11 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.1.0/vspackage)

- 增加语言服务器语言

### 0.0.1 | 2019-12-03 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.0.1/vspackage)

- 文字高亮 同vue插件
