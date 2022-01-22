module.exports = {
  title: "Jinyang's Blog",
  themeConfig: {
    nav: [{
        text: "Home",
        link: "/"
      },
      {
        text: "About",
        link: "https://github.com/Jinyang79"
      },
      {
        text: "Github",
        link: "https://github.com/Jinyang79/jinyang.github.io"
      },
    ],
    sidebar: [
      // {
      //   text: 'VitePress 使用',
      //   link: '/blog/vitepress'
      // },
      {
        text: '更优雅的 JS 代码',
        link: '/blog/elegant-js-code'
      },
      {
        text: 'AntD 4.x 升级记录',
        link: '/blog/antd-upgrade-log'
      },
      {
        text: 'VSCode 个人使用插件',
        link: '/blog/vscode-plugins'
      },
      {
        text: 'React 项目 Vite 迁移记录',
        link: '/blog/vite-migrate-log'
      },
      {
        text: '在 React 项目中引入 CDN',
        link: '/blog/cdn-in-react'
      },
      {
        text: '基于 SheetJs 实现前端导入导出',
        link: '/blog/util-xlsx'
      },
    ],

  }
};