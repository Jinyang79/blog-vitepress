# React 项目中引入 CDN

## 问题

我在项目中需要将`json`文件和`xlsx`文件相互转化，所以使用第三方库 [SheetJS](https://github.com/SheetJS/sheetjs) 来实现需求，但是项目一开始使用`npm`安装`xlsx`，通过`webpack-bundle-analyzer`分析，`xlsx`打包后的产物相对较大（如下图）。

![image-20211227174544242](https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112271745477.png)

## 方案

为了减小项目`webpack`打包后产物的 size，因此选择以`CDN`的方式引入`xlsx`，**并且不能影响我们在项目中通过`ESM`导入的方式使用**，所以通过配置 [webpack externals](https://www.webpackjs.com/configuration/externals/) 来实现我们的需求。

**index.html**

```html
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.17.4/dist/xlsx.full.min.js"></script>
```

**webpack.config.js**

```js
externals: {
  xlsx: 'XLSX';
}
```

这样下面展示的代码就可以正常运行：

```js
import XLSX from 'xlsx';
```

优化后，打包体积减少了约 300+ kb 如下图

<img src="https://raw.githubusercontent.com/Jinyangava/blog-image/master/img/202112282025083.png" alt="image-20211228202507055" style="zoom:50%;" />

## 参考

> <https://www.webpackjs.com/configuration/externals/>
