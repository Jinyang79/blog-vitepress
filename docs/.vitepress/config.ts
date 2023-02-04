import { defineConfig } from 'vitepress';

export default defineConfig({
  // lang: 'en-US',
  title: "Jinyang's Blog",
  description: 'share.',

  lastUpdated: true,
  cleanUrls: true,

  head: [
    [
      'meta',
      {
        name: 'theme-color',
        content: '#3c8772',
      },
    ],
  ],

  markdown: {
    headers: {
      level: [0, 0],
    },
  },

  themeConfig: {
    nav: nav(),
    sidebar: sidebarGuide(),

    // editLink: {
    //   pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
    //   text: 'Edit this page on GitHub',
    // },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Jinyang79/blog-vitepress',
      },
    ],

    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2019-present Evan You',
    // },

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
      text: 'Home',
      link: '/',
    },
    {
      text: 'About',
      link: 'https://github.com/Jinyang79',
    },
    // {
    //   text: 'Github',
    //   link: 'https://github.com/Jinyang79/jinyang.github.io',
    // },
  ];
}

function sidebarGuide() {
  return [
    {
      text: 'Front-end',
      collapsed: false,
      items: [
        {
          text: 'Code Style',
          link: '/blog/Front-end/code-style',
        },
        {
          text: 'AntD 4.x 升级记录',
          link: '/blog/Front-end/antd-upgrade-log',
        },
        {
          text: 'React 项目 Vite 迁移记录',
          link: '/blog/Front-end/vite-migrate-log',
        },
        {
          text: 'React 项目中引入 CDN',
          link: '/blog/Front-end/cdn-in-react',
        },
        {
          text: '前端导入导出 by SheetJs',
          link: '/blog/Front-end/util-xlsx',
        },
        {
          text: 'React Hook - useRequest',
          link: '/blog/Front-end/useRequest',
        },
      ],
    },
    {
      text: 'Dev-tool',
      collapsed: false,
      items: [
        {
          text: 'VSCode Plugins',
          link: '/blog/Dev-tool/vscode-plugins',
        },
        {
          text: 'Prettier Plugins',
          link: '/blog/Dev-tool/prettier-config',
        },
      ],
    },
    {
      text: 'Code-life',
      collapsed: false,
      items: [
        // { text: "Markdown", link: "/guide/markdown" },
      ],
    },
  ];
}

function sidebarConfig() {
  return [
    {
      text: 'Config',
      items: [
        {
          text: 'Introduction',
          link: '/config/introduction',
        },
        {
          text: 'App Configs',
          link: '/config/app-configs',
        },
        {
          text: 'Theme Configs',
          link: '/config/theme-configs',
        },
        {
          text: 'Frontmatter Configs',
          link: '/config/frontmatter-configs',
        },
      ],
    },
  ];
}
