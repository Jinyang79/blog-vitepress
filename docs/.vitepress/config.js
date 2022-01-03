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
      //   text: 'React 项目 vite 迁移记录',
      //   link: '/blog/vite-migrate-log'
      // },
      // {
      //   text: 'VitePress 使用',
      //   link: '/blog/vitepress'
      // },
      {
        text: 'AntD 4.x 升级记录',
        link: '/blog/antd-upgrade-log'
      },
      {
        text: '更优雅的 js 代码',
        link: '/blog/elegant-js-code'
      },
      {
        text: 'vscode 个人使用插件',
        link: '/blog/vscode-plugins'
      },
      {
        text: 'React 项目中使用 cdn 引入 js',
        link: '/blog/cdn-in-react'
      },
    ],

  }
};