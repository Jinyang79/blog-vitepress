# React 项目 Vite 迁移记录

![youxiaoyou](https://gitee.com/jinyang7/blog-image/raw/master/img/202201221849441.jpg)

## 前言

Vite 2.0 正式版在 21 年春节就发布了，之前一直有在关注尤大的社交账号，尤大在论坛上疯狂安利，当时就留下了很深的印象，正好今年 6 月，我有一场公司的分享会，于是想把手上的一个 React 小项目迁移，记录踩坑，然后作为分享内容。**这里只是记录了我在项目中迁移遇到的坑，其他问题基本上可以在 [Vite/issue](https://github.com/Vitejs/Vite/issues) 中找到**。最后关于 Vite 和[为什么选 Vite](https://Vitejs.cn/guide/why.html#why-Vite)，本文就不再阐述，官网已经给出了答案，Let's go！

先来看看迁移后的效果（同一项目的启动时间）

通过 webpack 启动，**大概在  45s 左右**。

![dev by webpack](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261817225.gif)

通过 Vite 启动，**时间大概在  1.2s！！！** 😱

![dev by Vite](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261817609.gif)



## 开始迁移

### 移除 webpack 相关文件/依赖

1.项目经过 eject 后会暴露配置，移除 `config` `scripts` 目录。

![image-20210626181607914](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261749441.png)![image-20210626183201556](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261749403.png)

2.移除所有 webpack 相关依赖（webpack, xxx-loader, xxx-webpack-plugin，babel-xxx，postcss-xxx）



### 引入 Vite

install devDependencies

```powershell
yarn add Vite @Vitejs/plugin-react-refresh -D
```

创建 `Vite.config.js`

```js
// Vite.config.js
import { defineConfig } from "Vite";
import reactRefresh from "@Vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [
    // react-refresh插件
    reactRefresh(),
  ],
});
```

修改 `package.json`

```json
// package.json
{
  "scripts": {
    "start": "Vite",
    "build": "Vite build",
    "preview": "Vite preview",
    ...
  }
}
```

(如果没有使用 TypeScript，可以去除 `tsc`)

修改 `index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <!-- ... -->
    <link rel="manifest" href="/src/assets/manifest.json" />
    <link rel="shortcut icon" href="/src/assets/favicon.ico" />
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

将 `public/index.html` 移至根目录下，其他文件移至 `src/assets/` 下, 然后可以移除 `public` 目录。



### 启动 dev server

```powershell
yarn start
```

![image-20210630180546833](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261749614.png)![image-20210630180708132](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261749274.png)

项目正常启动了，控制台抛出一大堆错误，无法显示页面，这时就**需要我们对项目的开发环境和生产环境做一些调整**，才能保证我们的项目正常运行。



### 开发环境

---

#### 浏览器兼容

Vite2 使用了 ESM ，不支持 IE 等旧浏览器，可以使用官方插件 [@Vitejs/plugin-legacy](https://github.com/Vitejs/Vite/tree/main/packages/plugin-legacy) 对其支持

```js
// Vite.config.js
import legacy from "@Vitejs/plugin-legacy";

export default {
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
};
```

#### Proxy

为开发服务器配置自定义代理规则，我项目使用的是 [http-proxy-middleware](https://www.npmjs.com/package/http-proxy-middleware)。

在 Vite 中使用 [server.proxy](https://Vitejs.cn/config/#server-proxy) 配置代理

```js
// Vite.config.js
export default defineConfig({
  server: {
    proxy: {
      "/xxxxService": {
        target: "http://xxxx.dev.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xxxxService/, ""),
      },
    },
  },
});
```

#### 自定义 antd 主题色

使用 [vite-plugin-imp](https://github.com/onebay/vite-plugin-imp) 按需导入样式。

通过 css.preprocessorOptions 指定传递给 CSS 预处理器的选项，自定义样式。

```js
// Vite.config.js
import VitePluginImp from 'Vite-plugin-imp'

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // 重写 less 变量，定制样式
        modifyVars: {
          '@primary-color': '#29b7b7',
          '@link-color': '#29b7b7'
        }
      }
    },
  plugins: [
    // 按需引用的插件, 因为主题设置不能 modifyVars
    VitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`
        }
      ]
    })
  ],

})
```

#### Postcss

[css.postcss](https://Vitejs.cn/config/#css-postcss)

```js
import flexbugsFixes from "postcss-flexbugs-fixes";
import presetEnv from "postcss-preset-env";
import postcssNormalize from "postcss-normalize";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        flexbugsFixes(),
        postcssNormalize(),
        presetEnv({
          autoprefixer: {
            flexbox: "no-2009",
          },
          stage: 3,
        }),
      ],
    },
  },
});
```

#### 路径别名问题

❌ error:

![image-20210630181211545](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261749773.png)

🐛 Fix:

```js
// import { resolve } from 'path'
// ...
export default defineConfig({
  // ...
  resolve: {
    // 写法1
    alias: [{ find: /^~/, replacement: "" }],
    // 写法2
    // alias: {
    //   '@': resolve(__dirname, 'src'),
    // },
  },
});
```

> <https://github.com/Vitejs/Vite/issues/2185>

#### process is not defined

❌ error:

process is not defined

🐛 Fix:

Vite 中不再使用 `process.env.XXX` 来读取环境变量，取而代之的是使用 [import.meta.env](https://Vitejs.cn/guide/env-and-mode.html) 对象上暴露环境变量

> 为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 Vite 处理的代码。

[process.argv](http://nodejs.cn/api/process/process_argv.html)

```js
--- process.env.REACT_APP_BUILD_ENV = process.argv[2]

--- const env = process.env.REACT_APP_BUILD_ENV
+++ const env = import.meta.env.VITE_APP_ENV
```

```json
// package.json
"scripts": {
    "start": "cross-env VITE_APP_ENV=loacl Vite"
    // ...
  },
```

#### Vite-tsconfig-paths

❌ error:

使用 tsconfig baseUrl 失效问题

🐛 Fix:

[Vite-tsconfig-paths](https://github.com/aleclarson/Vite-tsconfig-paths) 提供 [`Vite`](https://github.com/Vitejs/Vite) 使用 TypeScript 的路径映射解析导入的能力。

```js
plugins: [
    // ...
    // 解决 tsconfig baseUrl 失效问题
    tsconfigPaths(),
  ],
```

#### require is not defined

❌ error:

![image-20210705135729627](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261750088.png)

🐛 Fix:

浏览器是不支持 require ，通过 ESM 导入

```js
import qs from "query-string";
```

#### global is not defined

❌ error:

![image-20210705144234355](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261750996.png)

🐛 Fix:

```html
<!-- index.html -->
<script>
  const global = globalThis;
</script>
```

> <https://github.com/Vitejs/Vite/issues/2778>



### 生产环境

---

#### 修改输出路径

指定输出路径（[默认为 dist](https://Vitejs.cn/config/#build-outdir)），我项目中使用的是 build 。

```js
export default defineConfig({
  build: {
    outDir: "build",
  },
});
```

#### 环境变量配置

这里根据项目的具体情况配置，以下仅作为参考

```json
{
  "scripts": {
    "start": "cross-env VITE_APP_ENV=localhost Vite",
    "build": "tsc && Vite build --mode localhost",
    "preview": "Vite preview",
    "build_dev": "tsc && Vite build --mode dev",
    "build_demo": "tsc && Vite build --mode demo",
    "build_testing": "tsc && Vite build --mode testing",
    "test": "node scripts/test.js",
    "lint": "eslint --ext jsx,js src",
    "lint_fix": "eslint --fix src"
  }
}
```

```env
// .env.testing
NODE_ENV=production
VITE_APP_ENV=testing
```

#### Cannot read property 'defineLocale' of undefined

![image-20210708113519756](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261750685.png)

```js
--- import 'moment/locale/zh-cn'
+++ import 'moment/dist/locale/zh-cn'
```

#### Failed to resolve module specifier "indexof"

![image-20210708145138025](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261750989.png)

https://github.com/Vitejs/Vite/issues/2670



调整完成后，项目就可以正常运行啦🎉。

## 参考

> https://Vitejs.cn/
>
> https://github.com/Vitejs/Vite/issues
>
> https://blog.mutoe.com/2021/react-Vite-migration/
