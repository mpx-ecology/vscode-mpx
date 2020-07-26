import * as ts from "typescript";

export default {
  mpx: [
    {
      name: "mpx.request",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "网络请求",
      insertText:
        "mpx.request({\n  url: '${1:url}', //开发者服务器接口地址\",\n  data: '${2:data}', //请求的参数\",\n  method: '${3|GET,OPTIONS, HEAD, POST, PUT, DELETE, TRACE, CONNECT|}',\n  dataType: '${4:json}', //如果设为json，会尝试对返回的数据做一次 JSON.parse\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.uploadFile",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "文件上传",
      insertText:
        "mpx.uploadFile({\n  url: '${1:url}', //开发者服务器 url\n  filePath: '${2:filePath}', //要上传文件资源的路径\n  name: '${3:name}', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.downloadFile",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "文件下载",
      insertText:
        'mpx.downloadFile({\n  url: "${1:url}", // 下载资源的 url\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});'
    },
    {
      name: "mpx.connectSocket",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "创建Socket连接",
      insertText:
        "mpx.uploadFile({\n  url: '${1:url}', //开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名\n  method: '${2:GET}', //有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT\n  protocols: '{{${3:protocols}}}', //子协议数组\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.onSocketOpen",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听WebSocket连接打开事件",
      insertText:
        "mpx.onSocketOpen(res => {\n  console.log('WebSocket连接已打开！');\n});"
    },
    {
      name: "mpx.onSocketError",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听WebSocket错误",
      insertText:
        "mpx.onSocketError(res => {\n  console.log('WebSocket连接打开失败，请检查！');\n});"
    },
    {
      name: "mpx.sendSocketMessage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送",
      insertText:
        "mpx.sendSocketMessage({\n  data: '${1:data}', //需要发送的内容\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.onSocketMessage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听WebSocket接受到服务器的消息事件",
      insertText:
        "mpx.onSocketMessage(res => {\n  console.log('收到服务器内容：' + res.data);\n});"
    },
    {
      name: "mpx.closeSocket",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "关闭 WebSocket 连接",
      insertText:
        "mpx.closeSocket(res => {\n  console.log('WebSocket 已关闭！');\n});"
    },
    {
      name: "mpx.onSocketClose",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听WebSocket关闭",
      insertText:
        "mpx.onSocketClose(res => {\n  console.log('WebSocket 已关闭！');\n});"
    },
    {
      name: "mpx.chooseImage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "从本地相册选择图片或使用相机拍照",
      insertText:
        "mpx.chooseImage({\n  count: '${1:9}', //最多可以选择的图片张数,\n  success: res => {}, //返回图片的本地文件路径列表 tempFilePaths,\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.previewImage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "预览图片",
      insertText:
        "mpx.previewImage({\n  urls: '${1:urls}' //需要预览的图片链接列表,\n});"
    },
    {
      name: "mpx.getImageInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取图片信息",
      insertText:
        "mpx.getImageInfo({\n  src: '${1:src}', //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径,\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.saveImageToPhotosAlbum",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "保存图片到系统相册 需要用户授权 scope.writePhotosAlbum",
      insertText:
        "mpx.saveImageToPhotosAlbum({\n  filePath: '${1:filePath}', //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.login",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "调用接口wx.login() 获取临时登录凭证（code）",
      insertText:
        "mpx.login({\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.checkSession",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "校验用户当前session_key是否有效",
      insertText:
        "mpx.checkSession({\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.authorize",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。",
      insertText:
        "mpx.authorize({\n  scope:\n    '${1|scope.userInfo,scope.userLocation,scope.address,scope.invoiceTitle,scope.werun,scope.record,scope.writePhotosAlbum,scope.camera|}',\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.getUserInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口。需要用户授权 scope.userInfo",
      insertText:
        "mpx.getUserInfo({\n  withCredentials: false,\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.requestPayment",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "发起微信支付",
      insertText:
        "mpx.requestPayment({\n  timeStamp: '${1:timeStamp}', //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,\n  nonceStr: '${2:nonceStr}', //随机字符串，长度为32个字符以下,\n  package: '${3:package}', //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,\n  signType: 'MD5', //签名算法，暂支持 MD5,\n  paySign: '${4:paySign}', //签名,具体签名方案参见小程序支付接口文档,\n  success: res => {},\n  fail: () => {},\n  complete: () => {}\n});"
    },
    {
      name: "mpx.onShareAppMessage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "在 Page 中定义 onShareAppMessage 函数，设置该页面的转发信息",
      insertText:
        "onShareAppMessage() {\n  return {\n    title: '${1:自定义转发标题}',\n    path: '${2:/pages/index}',\n    imageUrl: '${3:url}',\n    success: res => {},\n    fail: () => {},\n    complete: () => {}\n  };\n}"
    },
    {
      name: "mpx.showShareMenu",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "显示当前页面的转发按钮",
      insertText: "mpx.showShareMenu({ withShareTicket: true });"
    },
    {
      name: "mpx.hideShareMenu",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "隐藏当前页面的转发按钮",
      insertText: "mpx.hideShareMenu();"
    },
    {
      name: "mpx.updateShareMenu",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "更新转发属性",
      insertText: "mpx.updateShareMenu({ withShareTicket: true });"
    },
    {
      name: "mpx.getShareInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取转发详细信息",
      insertText: "mpx.getShareInfo({ withShareTicket: true });"
    },
    {
      name: "mpx.chooseAddress",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址 需要用户授权 scope.address",
      insertText:
        "mpx.chooseAddress({\n  success: function(res) {\n    console.log(res.userName);\n    console.log(res.postalCode);\n    console.log(res.provinceName);\n    console.log(res.cityName);\n    console.log(res.countyName);\n    console.log(res.sourceInfo);\n    console.log(res.nationalCode);\n    console.log(res.telNumber);\n  }\n});"
    },
    {
      name: "mpx.addCard",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "批量添加卡券",
      insertText:
        'mpx.addCard({\n  cardList: [\n    {\n      cardId: \'\',\n      cardExt: \'{"code": "", "openid": "", "timestamp": "", "signature":""}\'\n    }\n  ],\n  success: function(res) {\n    console.log(res.cardList); // 卡券添加结果\n  }\n});'
    },
    {
      name: "mpx.openCard",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "查看微信卡包中的卡券",
      insertText:
        "mpx.openCard({\n  //需要打开的卡券列表，列表内参数详见openCard 请求对象说明\n  cardList: [\n    {\n      cardId: '',\n      code: ''\n    }\n  ],\n  success: function(res) {}\n});"
    },
    {
      name: "mpx.openSetting",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "调起客户端小程序设置界面，返回用户设置的操作结果",
      insertText: "mpx.openSetting({ success: res => {} });"
    },
    {
      name: "mpx.getSetting",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取用户的当前设置",
      insertText: "mpx.getSetting({ success: res => {} });"
    },
    {
      name: "mpx.getWeRunData",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "获取用户过去三十天微信运动步数，需要先调用 wx.login 接口 需要用户授权 scope.werun",
      insertText: "mpx.getWeRunData({ success: res => {} });"
    },
    {
      name: "mpx.navigateToMiniProgram",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "打开同一公众号下关联的另一个小程序。（注：必须是同一公众号下，而非同个 open 账号下）",
      insertText:
        "mpx.navigateToMiniProgram({\n  appId: '${1:appId}', //要打开的小程序 appId,\n  path: '', //打开的页面路径，如果为空则打开首页,\n  success: res => {}\n});"
    },
    {
      name: "mpx.navigateBackMiniProgram",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功",
      insertText: "mpx.navigateBackMiniProgram({ success: res => {} });"
    },
    {
      name: "mpx.chooseInvoiceTitle",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "选择用户的发票抬头 要用户授权 scope.invoiceTitle",
      insertText: "mpx.chooseInvoiceTitle({ success: res => {} });"
    },
    {
      name: "mpx.checkIsSupportSoterAuthentication",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取本机支持的 SOTER 生物认证方式",
      insertText:
        "mpx.checkIsSupportSoterAuthentication({\n  success: res => {}\n});"
    },
    {
      name: "mpx.startSoterAuthentication",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "开始 SOTER 生物认证",
      insertText:
        "mpx.startSoterAuthentication({\n  requestAuthModes: '${1:requestAuthModes}', //请求使用的可接受的生物认证方式,\n  challenge: '${2:requestAuthModes}', //挑战因子。挑战因子为调用者为此次生物鉴权准备的用于签名的字符串关键识别信息，将作为result_json的一部分，供调用者识别本次请求,\n  success: res => {}\n});"
    },
    {
      name: "mpx.checkIsSoterEnrolledInDevice",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取设备内是否录入如指纹等生物信息的接口",
      insertText:
        "mpx.checkIsSoterEnrolledInDevice({\n  checkAuthMode: '${1|fingerPrint,facial,speech|}', //认证方式,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getExtConfig",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取第三方平台自定义的数据字段。",
      insertText: "mpx.getExtConfig({ success: res => {} });"
    },
    {
      name: "mpx.getExtConfigSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取第三方平台自定义的数据字段的同步接口",
      insertText: "mpx.getExtConfigSync();"
    },
    {
      name: "mpx.showToast",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "显示消息提示框",
      insertText:
        "mpx.showToast({\n  title: '${1:title}', //提示的内容,\n  icon: '${2|success,loading,none|}', //图标,\n  duration: 2000, //延迟时间,\n  mask: true, //显示透明蒙层，防止触摸穿透,\n  success: res => {}\n});"
    },
    {
      name: "mpx.showLoading",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框",
      insertText:
        "mpx.showLoading({\n  title: '${1:Loading...}', //提示的内容,\n  mask: true, //显示透明蒙层，防止触摸穿透,\n  success: res => {}\n});"
    },
    {
      name: "mpx.hideToast",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "隐藏消息提示框",
      insertText: "mpx.hideToast();"
    },
    {
      name: "mpx.hideLoading",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "隐藏loading提示框",
      insertText: "mpx.hideLoading();"
    },
    {
      name: "mpx.showModal",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​显示模态弹窗",
      insertText:
        "mpx.showModal({\n  title: '${1:提示}', //提示的标题,\n  content: '${2:content}', //提示的内容,\n  showCancel: true, //是否显示取消按钮,\n  cancelText: '${3:取消}', //取消按钮的文字，默认为取消，最多 4 个字符,\n  cancelColor: '${4:#000000}', //取消按钮的文字颜色,\n  confirmText: '${5:确定}', //确定按钮的文字，默认为取消，最多 4 个字符,\n  confirmColor: '${6:#3CC51F}', //确定按钮的文字颜色,\n  success: res => {\n    if (res.confirm) {\n      console.log('用户点击确定')\n    } else if (res.cancel) {\n      console.log('用户点击取消')\n    }\n  }\n});"
    },
    {
      name: "mpx.showActionSheet",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​显示操作菜单",
      insertText:
        "mpx.showActionSheet({\n  itemList: '${1:itemList}', //按钮的文字数组，数组长度最大为6个,\n  itemColor: '${2:#000000}', //按钮的文字颜色,\n  success: res => {}\n});"
    },
    {
      name: "mpx.setNavigationBarTitle",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​动态设置当前页面的标题",
      insertText: "mpx.setNavigationBarTitle({ title: '${1:title}' });"
    },
    {
      name: "mpx.showNavigationBarLoading",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "在当前页面显示导航条加载动画",
      insertText: "mpx.showNavigationBarLoading();"
    },
    {
      name: "mpx.hideNavigationBarLoading",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "隐藏导航条加载动画",
      insertText: "mpx.hideNavigationBarLoading();"
    },
    {
      name: "mpx.setNavigationBarColor",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​设置导航条颜色",
      insertText:
        "mpx.setNavigationBarColor({\n  frontColor: '${1:#ffffff}', //前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000,\n  backgroundColor: '${2:#ff0000}', //背景颜色值，有效值为十六进制颜色,\n  success: res => {}\n});"
    },
    {
      name: "mpx.setTabBarBadge",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​为 tabBar 某一项的右上角添加文本",
      insertText:
        "mpx.setTabBarBadge({\n  index: 0, //tabBar的哪一项，从左边算起,\n  text: '${2:1}' //显示的文本，超过 3 个字符则显示成“…”,\n});"
    },
    {
      name: "mpx.removeTabBarBadge",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​移除 tabBar 某一项右上角的文本",
      insertText:
        "mpx.removeTabBarBadge({\n  index: 0 //tabBar的哪一项，从左边算起,\n});"
    },
    {
      name: "mpx.showTabBarRedDot",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​显示 tabBar 某一项的右上角的红点",
      insertText:
        "mpx.showTabBarRedDot({\n  index: 0 //tabBar的哪一项，从左边算起,\n});"
    },
    {
      name: "mpx.hideTabBarRedDot",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​隐藏 tabBar 某一项的右上角的红点",
      insertText:
        "mpx.hideTabBarRedDot({\n  index: 0 //tabBar的哪一项，从左边算起,\n});"
    },
    {
      name: "mpx.setTabBarStyle",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​动态设置 tabBar 的整体样式",
      insertText:
        "mpx.setTabBarStyle({\n  color: '${1:#FF0000}', //tab 上的文字默认颜色,\n  selectedColor: '${2:#00FF00}', //tab 上的文字选中时的颜色,\n  backgroundColor: '${3:#0000FF}', //tab 的背景色,\n  borderStyle: '${4:white}' //tabbar上边框的颜色， 仅支持 black/white,\n});"
    },
    {
      name: "mpx.setTabBarItem",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​动态设置 tabBar 某一项的内容",
      insertText:
        "mpx.setTabBarItem({\n  index: 0, //tabBar的哪一项，从左边算起,\n  text: '${1:text}', //tab 上按钮文字,\n  iconPath: '${2:iconPath}', //图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片,\n  selectedIconPath: '${3:selectedIconPath}' //选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效,\n});"
    },
    {
      name: "mpx.showTabBar",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​显示 tabBar",
      insertText: "mpx.showTabBar({\n  animation: true //是否需要动画效果\n});"
    },
    {
      name: "mpx.hideTabBar",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​隐藏 tabBar",
      insertText: "mpx.hideTabBar({\n  animation: true //是否需要动画效果\n});"
    },
    {
      name: "mpx.setTopBarText",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "​​动态设置置顶栏文字内容，只有当前小程序被置顶时能生效",
      insertText: "mpx.setTopBarText({ text: '${1:text}' });"
    },
    {
      name: "mpx.navigateTo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。",
      insertText: "mpx.navigateTo({ url: '${1:url}' });"
    },
    {
      name: "mpx.redirectTo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "关闭当前页面，跳转到应用内的某个页面",
      insertText: "mpx.redirectTo({ url: '${1:url}' });"
    },
    {
      name: "mpx.reLaunch",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "关闭所有页面，打开到应用内的某个页面",
      insertText: "mpx.reLaunch({ url: '${1:url}' });"
    },
    {
      name: "mpx.switchTab",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面",
      insertText: "mpx.switchTab({ url: '${1:url}' });"
    },
    {
      name: "mpx.navigateBack",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层",
      insertText:
        "mpx.navigateBack({\n  delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,\n});"
    },
    {
      name: "mpx.createAnimation",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法导出动画数据传递给组件的animation属性",
      insertText: "mpx.createAnimation({});"
    },
    {
      name: "mpx.pageScrollTo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "将页面滚动到目标位置",
      insertText:
        "mpx.pageScrollTo({\n  scrollTop: 0, //滚动到页面的目标位置（单位px）,\n  duration: 300 //滚动动画的时长，默认300ms，单位 ms,\n});"
    },
    {
      name: "mpx.startPullDownRefresh",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致",
      insertText: "mpx.startPullDownRefresh({ success: res => {} });"
    },
    {
      name: "mpx.stopPullDownRefresh",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "停止下拉刷新",
      insertText: "mpx.stopPullDownRefresh();"
    },
    {
      name: "mpx.makePhoneCall",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "拨打电话",
      insertText: "mpx.makePhoneCall({ phoneNumber: '${1:00000000}' });"
    },
    {
      name: "mpx.getLocation",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用；当用户点击“显示在聊天顶部”时，此接口可继续调用",
      insertText:
        'mpx.getLocation({\n  type: \'${1|wgs84,gcj02|}\', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,\n  success: res => {\n    console.info("getLocation success: ", res);\n    const latitude = res.latitude\n    const longitude = res.longitude\n    const speed = res.speed\n    const accuracy = res.accuracy\n  },\n  fail: () => {\n    console.log("getLocation failed")\n  }\n});'
    },
    {
      name: "mpx.chooseLocation",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "打开地图选择位置 需要用户授权 scope.userLocation",
      insertText: "mpx.chooseLocation({ success: res => {} });"
    },
    {
      name: "mpx.openLocation",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "使用微信内置地图查看位置 需要用户授权 scope.userLocation",
      insertText:
        "mpx.openLocation({\n  latitude: '${1:latitude}', //纬度，范围为-90~90，负数表示南纬,\n  longitude: '${2:longitude}', //经度，范围为-180~180，负数表示西经,\n  scale: 15, //缩放比例，范围5~18,\n  name: '${4:name}', //位置名,\n  address: '${5:address}', //地址的详细说明,\n  success: res => {}\n});"
    },
    {
      name: "mpx.setStorage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口",
      insertText:
        "mpx.setStorage({\n  key: '${1:key}',\n  data: '${2:data}'\n});"
    },
    {
      name: "mpx.setStorageSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口",
      insertText: "mpx.setStorageSync('${1:key}','${2:data}')\n});"
    },
    {
      name: "mpx.getStorage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "从本地缓存中异步获取指定 key 对应的内容",
      insertText:
        "mpx.getStorage({\n  key: '${key:key}',\n  success: (res) => {\n    console.log(res.data)\n  },\n  fail: () => { },\n  complete: () => { }\n})"
    },
    {
      name: "mpx.getStorageSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "从本地缓存中同步获取指定 key 对应的内容",
      insertText: "mpx.getStorageSync('${1:key}');"
    },
    {
      name: "mpx.getStorageInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "异步获取当前storage的相关信息",
      insertText: "mpx.getStorageInfo({ success: res => {} });"
    },
    {
      name: "mpx.getStorageInfoSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "同步获取当前storage的相关信息",
      insertText: "mpx.getStorageInfoSync();"
    },
    {
      name: "mpx.removeStorage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "从本地缓存中异步移除指定 key",
      insertText:
        "mpx.removeStorage({\n  key: '${1:key}',\n  success: res => {}\n});"
    },
    {
      name: "mpx.removeStorageSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "从本地缓存中同步移除指定 key",
      insertText: "mpx.removeStorageSync({ key: '${1:key}' });"
    },
    {
      name: "mpx.clearStorage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "清理本地数据缓存",
      insertText: "mpx.clearStorage();"
    },
    {
      name: "mpx.clearStorageSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "同步清理本地数据缓存",
      insertText: "mpx.clearStorageSync();"
    },
    {
      name: "mpx.saveFile",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "保存文件到本地。注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用",
      insertText:
        "mpx.saveFile({\n  tempFilePath: '${1:tempFilePath}', //需要保存的文件的临时路径,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getFileInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取文件信息",
      insertText:
        "mpx.getFileInfo({\n  filePath: '${1:filePath}', //本地文件路径,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getSavedFileList",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取本地已保存的文件列表",
      insertText: "mpx.getSavedFileList({ success: res => {} });"
    },
    {
      name: "mpx.getSavedFileInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo 接口",
      insertText:
        "mpx.getSavedFileInfo({\n  filePath: '${1:filePath}', //文件路径,\n  success: res => {}\n});"
    },
    {
      name: "mpx.removeSavedFile",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "删除本地存储的文件",
      insertText:
        "mpx.removeSavedFile({\n  filePath: '${1:filePath}', //文件路径,\n  success: res => {}\n});"
    },
    {
      name: "mpx.openDocument",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx",
      insertText:
        "mpx.openDocument({\n  filePath: '${1:filePath}', //文件路径，可通过 downFile 获得,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getSystemInfo",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取系统信息",
      insertText: "mpx.getSystemInfo({ success: res => {} });"
    },
    {
      name: "mpx.getSystemInfoSync",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取系统信息同步接口",
      insertText: "mpx.getSystemInfoSync();"
    },
    {
      name: "mpx.getNetworkType",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取网络类型",
      insertText: "mpx.getNetworkType({ success: res => {} });"
    },
    {
      name: "mpx.onNetworkStatusChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听网络状态变化",
      insertText: "mpx.onNetworkStatusChange(res => {});"
    },
    {
      name: "mpx.onAccelerometerChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "监听加速度数据，频率：5次/秒，接口调用后会自动开始监听，可使用 wx.stopAccelerometer 停止监听",
      insertText: "mpx.onAccelerometerChange(res => {});"
    },
    {
      name: "mpx.startAccelerometer",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "开始监听加速度数据",
      insertText: "mpx.startAccelerometer();"
    },
    {
      name: "mpx.stopAccelerometer",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "停止监听加速度数据",
      insertText: "mpx.stopAccelerometer()"
    },
    {
      name: "mpx.onCompassChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "监听罗盘数据，频率：5次/秒，接口调用后会自动开始监听，可使用wx.stopCompass停止监听",
      insertText: "mpx.onCompassChange(res => {});"
    },
    {
      name: "mpx.startCompass",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "开始监听罗盘数据",
      insertText: "mpx.startCompass()"
    },
    {
      name: "mpx.stopCompass",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "停止监听罗盘数据",
      insertText: "mpx.stopCompass();"
    },
    {
      name: "mpx.scanCode",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "调起客户端扫码界面，扫码成功后返回对应的结果",
      insertText:
        "mpx.scanCode({\n  onlyFromCamera: true, //是否只能从相机扫码，不允许从相册选择图片,\n  success: res => {}\n});"
    },
    {
      name: "mpx.setClipboardData",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "设置系统剪贴板的内容",
      insertText:
        "mpx.setClipboardData({\n  data: '${1:data}', //需要设置的内容,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getClipboardData",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取系统剪贴板内容",
      insertText: "mpx.getClipboardData({ success: res => {} });"
    },
    {
      name: "mpx.openBluetoothAdapter",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "初始化小程序蓝牙模块，生效周期为调用wx.openBluetoothAdapter至调用wx.closeBluetoothAdapter或小程序被销毁为止",
      insertText: "mpx.openBluetoothAdapter({ success: res => {} });"
    },
    {
      name: "mpx.closeBluetoothAdapter",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "关闭蓝牙模块，使其进入未初始化状态。调用该方法将断开所有已建立的链接并释放系统资源",
      insertText: "mpx.closeBluetoothAdapter({ success: res => {} });"
    },
    {
      name: "mpx.getBluetoothAdapterState",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取本机蓝牙适配器状态",
      insertText: "mpx.getBluetoothAdapterState({ success: res => {} });"
    },
    {
      name: "mpx.onBluetoothAdapterStateChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听蓝牙适配器状态变化事件",
      insertText: "mpx.onBluetoothAdapterStateChange(res => {});"
    },
    {
      name: "mpx.startBluetoothDevicesDiscovery",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "开始搜寻附近的蓝牙外围设备。注意，该操作比较耗费系统资源，请在搜索并连接到设备后调用 stop 方法停止搜索",
      insertText:
        "mpx.startBluetoothDevicesDiscovery({\n  success: res => {}\n});"
    },
    {
      name: "mpx.stopBluetoothDevicesDiscovery",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索",
      insertText:
        "mpx.stopBluetoothDevicesDiscovery({\n  success: res => {}\n});"
    },
    {
      name: "mpx.getBluetoothDevices",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备",
      insertText: "mpx.getBluetoothDevices({ success: res => {} });"
    },
    {
      name: "mpx.onBluetoothDeviceFound",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听寻找到新设备的事件",
      insertText: "mpx.onBluetoothDeviceFound(res => {});"
    },
    {
      name: "mpx.getConnectedBluetoothDevices",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "根据 uuid 获取处于已连接状态的设备",
      insertText:
        "mpx.getConnectedBluetoothDevices({\n  services: '${1:services}', //蓝牙设备主 service 的 uuid 列表,\n  success: res => {}\n});"
    },
    {
      name: "mpx.createBLEConnection",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "连接低功耗蓝牙设备",
      insertText:
        "mpx.createBLEConnection({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 getDevices 接口,\n  success: res => {}\n});"
    },
    {
      name: "mpx.closeBLEConnection",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "断开与低功耗蓝牙设备的连接",
      insertText:
        "mpx.closeBLEConnection({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 getDevices 接口,\n  success: res => {}\n});"
    },
    {
      name: "mpx.onBLEConnectionStateChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "监听低功耗蓝牙连接状态的改变事件，包括开发者主动连接或断开连接，设备丢失，连接异常断开等等",
      insertText: "mpx.onBLEConnectionStateChange(res => {});"
    },
    {
      name: "mpx.getBLEDeviceServices",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取蓝牙设备所有 service（服务）",
      insertText:
        "mpx.getBLEDeviceServices({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 getDevices 接口,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getBLEDeviceCharacteristics",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取蓝牙设备某个服务中的所有 characteristic（特征值）",
      insertText:
        "mpx.getBLEDeviceCharacteristics({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 device 对象,\n  serviceId: '${2:serviceId}', //蓝牙服务 uuid,\n  success: res => {}\n});"
    },
    {
      name: "mpx.readBLECharacteristicValue",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持read才可以成功调用，具体参照 characteristic 的 properties 属性",
      insertText:
        "mpx.readBLECharacteristicValue({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 device 对象,\n  serviceId: '${2:serviceId}', //蓝牙服务 uuid,\n  characteristicId: '${3:characteristicId}', //蓝牙特征值的 uuid,\n  success: res => {}\n});"
    },
    {
      name: "mpx.writeBLECharacteristicValue",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "读取低功耗蓝牙设备的特征值的二进制数据值。注意：必须设备的特征值支持read才可以成功调用，具体参照 characteristic 的 properties 属性",
      insertText:
        "mpx.writeBLECharacteristicValue({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 device 对象,\n  serviceId: '${2:serviceId}', //蓝牙服务 uuid,\n  characteristicId: '${3:characteristicId}', //蓝牙特征值的 uuid,\n  value: '${4:value}', //蓝牙设备特征值对应的二进制值,\n  success: res => {}\n});"
    },
    {
      name: "mpx.notifyBLECharacteristicValueChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值",
      insertText:
        "mpx.notifyBLECharacteristicValueChange({\n  deviceId: '${1:deviceId}', //蓝牙设备 id，参考 device 对象,\n  serviceId: '${2:serviceId}', //蓝牙服务 uuid,\n  characteristicId: '${3:characteristicId}', //蓝牙特征值的 uuid,\n  state: true, //true: 启用 notify; false: 停用 notify,\n  success: res => {}\n});"
    },
    {
      name: "mpx.onBLECharacteristicValueChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification",
      insertText: "mpx.onBLECharacteristicValueChange(res => {});"
    },
    {
      name: "mpx.startBeaconDiscovery",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "开始搜索附近的iBeacon设备",
      insertText:
        "mpx.startBeaconDiscovery({\n  uuids: '${1:uuids}', //iBeacon设备广播的 uuids,\n  success: res => {}\n});"
    },
    {
      name: "mpx.stopBeaconDiscovery",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "停止搜索附近的iBeacon设备",
      insertText: "mpx.stopBeaconDiscovery()"
    },
    {
      name: "mpx.getBeacons",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取所有已搜索到的iBeacon设备",
      insertText: "mpx.getBeacons({ success: res => {} });"
    },
    {
      name: "mpx.onBeaconUpdate",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听 iBeacon 设备的更新事件",
      insertText: "mpx.onBeaconUpdate(res => {});"
    },
    {
      name: "mpx.onBeaconServiceChange",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听 iBeacon 服务的状态变化",
      insertText: "mpx.onBeaconServiceChange(res => {});"
    },
    {
      name: "mpx.setScreenBrightness",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "设置屏幕亮度",
      insertText:
        "mpx.setScreenBrightness({\n  value: 1 //屏幕亮度值，范围 0~1，0 最暗，1 最亮,\n});"
    },
    {
      name: "mpx.getScreenBrightness",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取屏幕亮度",
      insertText: "mpx.getScreenBrightness({ success: res => {} });"
    },
    {
      name: "mpx.setKeepScreenOn",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效",
      insertText:
        "mpx.setKeepScreenOn({\n  keepScreenOn: true //是否保持屏幕常亮,\n});"
    },
    {
      name: "mpx.onUserCaptureScreen",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件",
      insertText: "mpx.onUserCaptureScreen(res => {});"
    },
    {
      name: "mpx.vibrateLong",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "使手机发生较长时间的振动（400ms）",
      insertText: "mpx.vibrateLong()"
    },
    {
      name: "mpx.vibrateShort",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "使手机发生较短时间的振动（15ms）",
      insertText: "mpx.vibrateShort()"
    },
    {
      name: "mpx.getHCEState",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "判断当前设备是否支持 HCE 能力",
      insertText: "mpx.getHCEState({ success: res => {} });"
    },
    {
      name: "mpx.startHCE",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "初始化 NFC 模块",
      // tslint:disable-next-line:max-line-length
      insertText:
        "mpx.startHCE({\n  aid_list: '${1:aid_list}', //需要注册到系统的 AID 列表，每个 AID 为 String 类型,\n  success: res => {}\n});"
    },
    {
      name: "mpx.stopHCE",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "关闭 NFC 模块 仅在安卓系统下有效",
      insertText: "mpx.stopHCE({ success: res => {} });"
    },
    {
      name: "mpx.onHCEMessage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听 NFC 设备的消息回调，并在回调中处理",
      insertText: "mpx.onHCEMessage(res => {});"
    },
    {
      name: "mpx.sendHCEMessage",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "发送 NFC 消息。仅在安卓系统下有效",
      insertText:
        "mpx.sendHCEMessage({\n  data: '${1:data}', //二进制数据,\n  success: res => {}\n});"
    },
    {
      name: "mpx.startWifi",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "初始化 Wi-Fi 模块",
      insertText: "mpx.startWifi({ success: res => {} });"
    },
    {
      name: "mpx.stopWifi",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "关闭 Wi-Fi 模块",
      insertText: "mpx.stopWifi({ success: res => {} });"
    },
    {
      name: "mpx.connectWifi",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "连接 Wi-Fi。若已知 Wi-Fi 信息，可以直接利用该接口连接。仅 Android 与 iOS 11 以上版本支持",
      insertText:
        "mpx.connectWifi({\n  SSID: '${1:SSID}', //Wi-Fi 设备ssid,\n  BSSID: '${2:BSSID}', //Wi-Fi 设备BSSID,\n  password: '${3:password}', //Wi-Fi 设备password,\n  success: res => {}\n});"
    },
    {
      name: "mpx.getWifiList",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "请求获取 Wi-Fi 列表",
      insertText: "mpx.getWifiList({\n  success: res => {}\n});"
    },
    {
      name: "mpx.getConnectedWifi",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "获取已连接中的 Wi-Fi 信息",
      insertText: "mpx.getConnectedWifi({ success: res => {} });"
    },
    {
      name: "mpx.onGetWifiList",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听在获取到 Wi-Fi 列表数据时的事件，在回调中将返回 wifiList",
      insertText: "mpx.onGetWifiList(res => {});"
    },
    {
      name: "mpx.onWifiConnected",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source: "监听连接上 Wi-Fi 的事件",
      insertText: "mpx.onWifiConnected(res => {});"
    },
    {
      name: "mpx.setWifiList",
      kind: ts.ScriptElementKind.functionElement,
      sortText: "4",
      source:
        "iOS特有接口 在 onGetWifiList 回调后，利用接口设置 wifiList 中 AP 的相关信息",
      insertText:
        "mpx.setWifiList({\n  wifiList: '${1:wifiList}', //提供预设的 Wi-Fi 信息列表,\n  success: res => {}\n});"
    }
  ]
};
