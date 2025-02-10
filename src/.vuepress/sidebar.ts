import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      // 项目文字
      text: "Nginx 使用",
      // 项目图标(可选)
      icon: "laptop-code",
      // 可选的，会添加到每个 item 链接地址之前
      prefix: "nginx/",
      // 可选的, 分组标题对应的链接
      link: "demo/",
      // 可选的, 设置分组是否可以折叠，默认值是 false,
      collapsible: true,
      // 可选的。设置分组是否默认展开，默认值是 false
      expanded: false,
      // 必要的，分组的子项目
      children: [
        "README.md" /* /foo/index.html */,
        /* ... */
        "geo.md" /* /foo/geo.html */,
      ],
    },
    // {
    //   text: "如何使用",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    // },
    // {
    //   text: "文章",
    //   icon: "book",
    //   prefix: "posts/",
    //   children: "structure",
    // },
    // "intro",
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    // },
  ],
});
