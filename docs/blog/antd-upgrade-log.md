# AntD 4.x 升级记录

> 通过 codemod cli 工具 [@ant-design/codemod-v4](https://github.com/ant-design/codemod-v4) 快速升级到 v4 版本。

```sh
# 通过 npx 直接运行
npx -p @ant-design/codemod-v4 antd4-codemod src

# 或者全局安装
# 使用 npm
npm i -g @ant-design/codemod-v4
# 或者使用 yarn
yarn global add @ant-design/codemod-v4

# 运行
antd4-codemod src

```

![image-20210506144156350](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723071.png)

检查 package.json , 安装或升级这些依赖项，以确保与 antd4 正常工作

```sh
yarn add antd @ant-design/icons @ant-design/compatible react react-dom
```

**如果没有改动过 antd 的样式, 到此自动升级完成**

## css 样式调整

### Icon

`@ant-design/compatible` 引入的老版本 Icon 组件，icon 将从 i 标签修改为 span 标签

3.x

![image-20210701135747119](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723880.png)

4.x

![image-20210701135846263](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723746.png)

```css
--- i.trigger {
}
+++span.trigger {
}
```

### Form

从 `@ant-design/compatible` 引入的老版本 Form 组件，样式类名会从 `.ant-form` 变成 `.ant-legacy-form`，如果你对其进行了样式覆盖，也需要相应修改。

**注意**：之前的样式也不要改，复制一份，等手动更新完后，再去除

### DatePicker

DatePicker 进行了重写，样式类名结构都有变化

`.ant-calendar-picker` 变成 `.ant-picker`

### Pagination

> Pagination 自 `4.1.0` 起大于 50 条数据默认会展示 `pageSize` 切换器，这条规则同样会运用于 Table 上。

showSizeChanger={false}

## dev server warning

生产环境正常使用，建议手动更改

### Icon

![image-20210629151020576](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723211.png)

项目中使用了 `<Icon type={type} />` 会转化成 `<LegacyIcon type={type} />`

```js
import { Icon as LegacyIcon } from "@ant-design/compatible";

// <LegacyIcon type={type} />
```

**注意**：迁移之后一定要修改它，不然会全量引入 svg 图标文件，导致增加了打包产物的 size。

使用新版 `Icon` 按需引入的方式

```js
import { LaptopOutlined } from "@ant-design/icons";
```

修改前

![image-20210701160319352](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723655.png)

修改后

![image-20210701160621081](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723724.png)

| Status | Size    | Size gzip |
| ------ | ------- | --------- |
| 修改前 | 735 kb  | 148 kb    |
| 修改后 | 23.6 kb | 7.5 kb    |

### Form

![image-20210629150959227](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723440.png)

```js
import { Form } from "@ant-design/compatible";
```

### Select

![image-20210629151114045](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723054.png)

#### 3.x

我们会在 `Select.Option` 添加自定义属性，`onChange` 触发

`function(value, option:Option | Array<Option>)`

然后通过下面方式读取它

```js
// <Option type="1" value="jack">Jack</Option>
const type = option.props.type;
```

option 返回的是 Option 实例

![image-20210702181326512](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261723688.png)

#### 4.x

返回类型是 option 而不是 Option 实例。请直接读取值，而不是从“props”。

![image-20210702181721310](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261724636.png)

```js
const type = option.type;
```

## [Day.js](https://github.com/iamkun/dayjs) 替换 Moment.js

### 1. 使用官方提供的插件

无需对现有代码做任何修改直接替换成 `Day.js`

[antd-dayjs-webpack-plugin](https://github.com/ant-design/antd-dayjs-webpack-plugin)

### 2.设置别名

> [resolve.alias](https://webpack.docschina.org/configuration/resolve/#resolvealias)

**webpack.config.js**

```js
module.exports = {
  //...
  resolve: {
    alias: {
      moment: "dayjs",
      //...
    },
  },
};
```

修改前

![image-20210702180214217](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261724556.png)

![image-20210702180234709](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261724060.png)

修改后

![image-20210702175606863](https://gitee.com/jinyang7/blog-image/raw/master/img/202112261724290.png)

| Status | Size    | Size gzip |
| ------ | ------- | --------- |
| 修改前 | 107 kb  | 35 kb     |
| 修改后 | 15.9 kb | 5.7 kb    |

> 参考：[官方升级指南](https://ant.design/docs/react/migration-v4-cn)
