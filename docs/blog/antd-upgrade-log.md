# AntD 4.x 升级记录

通过官方提供的 codemod cli 工具 [@ant-design/codemod-v4](https://github.com/ant-design/codemod-v4) 自动升级到 v4 版本。

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

![image-20210506144156350](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723071.png)

升级完这些依赖项后，**工具自动升级就完成啦 🎉。**

需要注意的两点是：

- **antd v4 版本的样式相对于 v3 有部分改动，如果在项目中修改过 antd 样式，要记得调整过来。**
- **升级工具会帮你迁移到 antd v4，废弃的组件会通过 `@ant-design/compatible` 这个包引入并保持运行，不会影响组件使用，但是会在 dev server 抛出 warning，为了保持系统的整体性，还是建议手动迁移。**

## css 调整

### Icon

`@ant-design/compatible` 引入的老版本 Icon 组件，icon 将从 i 标签修改为 span 标签

3.x

![image-20210701135747119](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723880.png)

4.x

![image-20210701135846263](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723746.png)

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

### Icon

![image-20210629151020576](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723211.png)

项目中使用了 `<Icon type={type} />` 会转化成 `<LegacyIcon type={type} />`

```js
import { Icon as LegacyIcon } from "@ant-design/compatible";

// <LegacyIcon type={type} />
```

**注意：升级之后一定要修改它，不然会全量引入 svg 图标文件，导致增加了打包产物的 size。**

使用新版 `Icon` 按需引入的方式

```js
import { LaptopOutlined } from "@ant-design/icons";
```

修改前

![image-20210701160319352](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723655.png)

修改后

![image-20210701160621081](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723724.png)

| Status | Size    | Size gzip |
| ------ | ------- | --------- |
| 修改前 | 735 kb  | 148 kb    |
| 修改后 | 23.6 kb | 7.5 kb    |

### Form

![image-20210629150959227](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723440.png)

```js
import { Form } from "@ant-design/compatible";
```

### Select

![image-20210629151114045](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723054.png)

#### 3.x

我们会在 `Select.Option` 添加自定义属性，`onChange` 触发

`function(value, option:Option | Array<Option>)`

然后通过下面方式读取它

```js
// <Option type="1" value="jack">Jack</Option>
const type = option.props.type;
```

option 返回的是 Option 实例

![image-20210702181326512](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261723688.png)

#### 4.x

返回类型是 option 而不是 Option 实例。请直接读取值，而不是从“props”。

![image-20210702181721310](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261724636.png)

```js
const type = option.type;
```

## 替换 Moment.js

> Q:：为什么要替换 Moment.js ？
>
> A：最重要的是它高度基于 OOP API，这使得它无法使用 tree-shaking，从而导致巨大的包大小和性能问题。
>
> Q:：为什么要选择 Day.js？
>
> A：轻量化，大小仅 2KB，并且和 Moment.js API 保持一致，迁移成本低。



官方提供了三种替换方案，我这里选择的是使用 [antd-dayjs-webpack-plugin](https://github.com/ant-design/antd-dayjs-webpack-plugin) 插件，因为它**无需对现有代码做任何修改**直接替换成 `Day.js`。

### webpack-config.js

```js
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new AntdDayjsWebpackPlugin()
  ]
};
```

修改前

![image-20210702180214217](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261724556.png)

![image-20210702180234709](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261724060.png)

修改后

![image-20210702175606863](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112261724290.png)

| Status | Size    | Size gzip |
| ------ | ------- | --------- |
| 修改前 | 107 kb  | 35 kb     |
| 修改后 | 15.9 kb | 5.7 kb    |

## 参考

> https://ant.design/docs/react/migration-v4-cn
>
> https://ant.design/docs/react/replace-moment-cn
>
> https://github.com/you-dont-need/You-Dont-Need-Momentjs/blob/master/README.md
