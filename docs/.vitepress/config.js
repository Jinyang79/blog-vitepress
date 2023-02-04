import { defineConfig } from "vitepress";

export default defineConfig({
  // lang: 'en-US',
  title: "Jinyang's Blog",
  description: "share.",

  lastUpdated: true,
  cleanUrls: true,

  head: [["meta", { name: "theme-color", content: "#3c8772" }]],

  markdown: {
    headers: {
      level: [0, 0],
    },
  },

  themeConfig: {
    nav: nav(),
    sidebar: sidebarGuide(),

    editLink: {
      pattern: "https://github.com/vuejs/vitepress/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Evan You",
    },

    // algolia: {
    //   appId: "8J64VVRP8K",
    //   apiKey: "a18e2f4cc5665f6602c5631fd868adfd",
    //   indexName: "vitepress",
    // },

    // carbonAds: {
    //   code: "CEBDT27Y",
    //   placement: "vuejsorg",
    // },
  },
});

function nav() {
  return [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "About",
      link: "https://github.com/Jinyang79",
    },
    {
      text: "Github",
      link: "https://github.com/Jinyang79/jinyang.github.io",
    },
  ];
}

function sidebarGuide() {
  return [
    {
      text: "react",
      collapsed: false,
      items: [
        {
          text: "更优雅的 JS 代码",
          link: "/blog/elegant-js-code",
        },
        {
          text: "AntD 4.x 升级记录",
          link: "/blog/antd-upgrade-log",
        },
        {
          text: "VSCode 个人使用插件",
          link: "/blog/vscode-plugins",
        },
        {
          text: "React 项目 Vite 迁移记录",
          link: "/blog/vite-migrate-log",
        },
        {
          text: "在 React 项目中引入 CDN",
          link: "/blog/cdn-in-react",
        },
        {
          text: "基于 SheetJs 实现前端导入导出",
          link: "/blog/util-xlsx",
        },
      ],
    },
    {
      text: "utils",
      collapsed: false,
      items: [
        // { text: "Markdown", link: "/guide/markdown" },
        // { text: "Asset Handling", link: "/guide/asset-handling" },
        // { text: "Frontmatter", link: "/guide/frontmatter" },
        // { text: "Using Vue in Markdown", link: "/guide/using-vue" },
        // { text: "API Reference", link: "/guide/api" },
      ],
    },
  ];
}

function sidebarConfig() {
  return [
    {
      text: "Config",
      items: [
        { text: "Introduction", link: "/config/introduction" },
        { text: "App Configs", link: "/config/app-configs" },
        { text: "Theme Configs", link: "/config/theme-configs" },
        { text: "Frontmatter Configs", link: "/config/frontmatter-configs" },
      ],
    },
  ];
}
