---
# 必须设置为 true 以使用博客主页布局。
home: true 
# 必须设置为 BlogHome 以使用博客主页布局。
layout: BlogHome 
icon: home
# 设置页面标题，会用于路径导航、页面增强等
title: 博客主页
# 主页图标 (logo) 地址
heroImage: https://theme-hope-assets.vuejs.press/logo.svg
# 主页标题
heroText: 你博客的名称
# 是否全屏显示 Hero
heroFullScreen: true
# 背景图片的地址，不支持相对路径。如果不填写，会自动应用一张默认的风景图片。
bgImage: https://uploadfile.bizhizu.cn/up/d6/1d/ec/d61dec3c362a66723dfb397dbd1f4dfc.jpg.source.jpg
# 深色模式下背景图片的地址，不支持相对路径。
bgImageDark: https://img0.baidu.com/it/u=1990404516,3112209744&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500
# 附加文字描述
tagline: 你可以在这里放置你的口号与标语
# 播客主页中的项目列表
projects:
  - icon: project # 项目图标 支持图片链接或者图标字体类，同时也支持 `"link"`、`"project"`、`"book"`、`"article"`、`"friend"`
    name: 项目名称 # 项目名称
    desc: 项目详细描述 # 项目描述
    link: https://你的项目链接 # 项目链接

  - icon: link
    name: 链接名称
    desc: 链接详细描述
    link: https://链接地址

  - icon: book
    name: 书籍名称
    desc: 书籍详细描述
    link: https://你的书籍链接

  - icon: article
    name: 文章名称
    desc: 文章详细描述
    link: https://你的文章链接

  - icon: friend
    name: 伙伴名称
    desc: 伙伴详细介绍
    link: https://你的伙伴链接

  - icon: https://theme-hope-assets.vuejs.press/logo.svg
    name: 自定义项目
    desc: 自定义详细介绍
    link: https://你的自定义链接

footer: 自定义你的页脚文字
---

这是一个博客主页的案例。

要使用此布局，你应该在页面前端设置 `layout: BlogHome` 和 `home: true`。

相关配置文档请见 [博客主页](https://theme-hope.vuejs.press/zh/guide/blog/home.html)。
