# Change Log

## All notable changes to the "vscode-mpx" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

### 0.2.14 | 2024-04-24 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.14/vspackage)

- 修复跳转定义问题
- 增加snipptes setup-ts-single & storeToRefs
- 增加template跳转定义功能

### 0.2.13 | 2022-09-14 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.13/vspackage)

- 修复eslint globals问题

### 0.2.12 | 2022-09-09 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.12/vspackage)

- 修复eslint问题

### 0.2.11 | 2022-09-09 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.11/vspackage)

- compositionAPI支持，eslint插件更新

### 0.2.10 | 2022-09-02 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.10/vspackage)

- 增加json模块定义跳转功能(`<script type="application/json">`)中组件名,路径均可跳转，(`<script name="json">`)仅支持路径。

### 0.2.9 | 2022-04-30 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.9/vspackage)

- 升级prettier
- 升级eslint

### 0.2.8 | 2022-03-30 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.8/vspackage)

- 修复[js模块格式化问题](https://github.com/mpx-ecology/vscode-mpx/issues/51)
- 修复stylus报错

### 0.2.7 | 2022-03-11 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.7/vspackage)
- 增加文件图标

### 0.2.6 | 2021-10-18 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.6/vspackage)
- 优化微信指令格式

### 0.2.5 | 2021-07-09 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.5/vspackage)
- 修复注释bug
- 修改snipptes的bug

### 0.2.4 | 2021-07-01 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.4/vspackage)
- 修复高亮问题

### 0.2.3 | 2021-06-29 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.3/vspackage)
- 修改format的默认缩进，`<style><javascript><json>`的内容都将默认根据设置的tabsize进行缩进，不再是0缩进，可配置`mpxIndentScriptAndStyle`修改

### 0.2.2 | 2021-05-04 | [VSIX](https://marketplace.visualstudio.com/_apis/public/gallery/publishers/pagnkelly/vsextensions/mpx/0.2.2/vspackage)

- 修复`name=json`Eslint影响ts模块问题

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
