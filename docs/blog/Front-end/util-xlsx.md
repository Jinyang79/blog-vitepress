# 前端导入导出 by SheetJs

## 需求

我的项目在很多地方都需要实现前端导入导出功能，为了使用方便，并且减少冗余代码，使代码更合理、更优雅，所以对 SheetJs 进行封装。

需要实现的是：

- 导出：将接口返回的`json`数据转化成`xlsx`格式。
- 导入：将`xlsx`格式转化成需要的`json`数据。

## 实现

### 导出

思路： 拿到 key 是表头的对象数组，通过`json_to_sheet`将 JS 对象数组转换为工作表。

1. 我们需要传入接口返回结果（res）的键和表头映射关系的二维数组（mapKeyToHeader）；
2. 把 mapKeyToHeader 转化成`Map`结构，使用 `for..of`或者 `forEach()`方法迭代 headerMap，把 res 的键对应的值赋值给表头；
3. 调用`json_to_sheet` 等 api，转换并下载`xlsx`文件；

#### jsonToXlsx.ts

```ts
import { message } from 'antd';
import XLSX from 'xlsx';

interface JsonToXlsxProps {
  /**
   * @description 接口返回结果
   * @type {Record<string, any>[]}
   */
  res: Record<string, any>[];
  /**
   * @description 文件名/第一个 sheet 名
   * @type {string}
   */
  fileName: string;
  /**
   * @description 映射 key 到 表头
   * @type {[string, string][]} [key, 表头]
   */
  mapKeyToHeader: [string, string][];
}

/**
 * @description json => xlsx (导出)
 * @export
 * @param {JsonToXlsxProps} {
 *   res,
 *   fileName,
 *   mapKeyToHeader
 * }
 */
export function jsonToXlsx({ res, fileName, mapKeyToHeader }: JsonToXlsxProps): void {
  const headerMap = new Map<string, string>(mapKeyToHeader);

  const exportData = res.map((item) => {
    const dataItem: Record<string, string> = {};

    headerMap.forEach((value, key) => {
      dataItem[value] = item[key];
    });

    return dataItem;
  });

  try {
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    message.error(`导出失败：${error}`);
  }
}
```

#### 使用

```tsx
// 请求获取 result
const { result } = api;

jsonToXlsx({
  res: result,
  fileName: '员工信息',
  mapKeyToHeader: [
    ['name', '姓名'],
    ['age', '年龄'],
    ['address', '地址'],
  ],
});
```

### 导入

思路：基于 antd 的 Upload 获取 file 对象，通过`sheet_to_json`将工作表转换为 JS 对象数组

1. 封装 xlsxToJson 方法，调用`sheet_to_json` 等 api，得到表格数据（data）；
2. 封装 CustomUpload 组件，通过 Upload 的 `customRequest` api 获取 file 对象；

#### xlsxToJson.ts

```ts
import XLSX from 'xlsx';
import { message } from 'antd';

interface XlsxToJsonProps {
  /**
   * @description file 对象
   * @type {File}
   */
  file: File;
  /**
   * @description 成功回调函数 data: 表头为 key 的 list
   */
  onSuccess: (data: Record<string, string>[]) => void;
}

/**
 * @description xlsx=> json  (导入)
 * @export
 * @param {XlsxToJsonProps} {
 *     file,
 *     onSuccess
 *   }
 */
export function xlsxToJson({ file, onSuccess }: XlsxToJsonProps): void {
  let data: Record<string, string>[] = [];

  // 通过 FileReader 对象读取文件
  const fileReader = new FileReader();
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(file);

  fileReader.onload = (event: ProgressEvent<FileReader>) => {
    try {
      const result = event.target?.result;

      const workbook = XLSX.read(result, { type: 'binary' });

      for (const sheet in workbook.Sheets) {
        if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
          data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
        }
      }

      onSuccess(data);
    } catch (error) {
      message.error(`导入失败：${error}`);
    }
  };
}
```

#### CustomUpload.tsx

```tsx
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { xlsxToJson } from 'utils/xlsx';

interface CustomUploadProps {
  /**
   * @description 上传按钮名
   * @type {string}
   */
  uploadBtnName: string;
  /**
   * @description 成功回调函数 data: 表头为 key 的 list
   */
  onSuccess: (data: Record<string, string>[]) => void;
}

/**
 * @description 自定义 Upload (by xlsxToJson)
 * @export
 * @param {CustomUploadProps} {
 *     uploadBtnName,
 *     onSuccess
 *   }
 * @returns {*}  {JSX.Element}
 * @tips 通过 antd Upload 获取 file 对象，然后通过 xlsxToJson;
 *       使用 Upload customRequest api 获取 file 对象;
 */
const CustomUpload = ({ uploadBtnName, onSuccess }: CustomUploadProps): JSX.Element => {
  return (
    <Upload
      accept='.xlsx, .xls'
      showUploadList={false}
      customRequest={({ file }) => {
        xlsxToJson({
          file: file as File,
          onSuccess,
        });
      }}
    >
      <Button icon={<UploadOutlined />}>{uploadBtnName}</Button>
    </Upload>
  );
};

export default CustomUpload;
```

#### 使用

```tsx
return (
  <CustomUpload
    uploadBtnName='上传员工信息'
    onSuccess={(data) => {
      console.log(data); // 表格的数据
      // 发起请求
      // ...
    }}
  />
);
```

## 参考

> <https://github.com/SheetJS/sheetjs>
>
> <https://ant.design/components/upload-cn/>
