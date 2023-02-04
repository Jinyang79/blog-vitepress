# React Hook - useRequest

## 前言

实现这个 Hook 的目的是为了**减少 React 项目中数据请求编写的重复代码。**

本文将以我的项目为例（👀 每个项目的数据请求风格可能不同，但大致思路相同）

下面标记的代码块就是数据请求编写的重复代码。

![image-20220812212303141](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab59a2cdaaff4da5a0926bc7f4f498a8~tplv-k3u1fbpfcp-zoom-1.image)

简单概括为以下几类

- 请求返回数据的声明和更新；
- 加载的 loading 的声明和更新；
- try...catch 错误捕获；
- isSuccess 接口成功验证字段 （不同项目存在差异）；
- ......

虽然日常业务开发 CV 就能解决 🤔，但是代码层面显得不够优雅 🐶。

于是我 Google 了一些社区的实现方案：

- 官方推荐的 [How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/) ；
- [react-use](https://github.com/streamich/react-use) 的 [useAsync](https://github.com/streamich/react-use/blob/master/docs/useAsync.md)，[useAsyncFn](https://github.com/streamich/react-use/blob/master/docs/useAsyncFn.md)；
- [ahooks](https://ahooks.js.org/) 的 [useRequest](https://ahooks.js.org/hooks/use-request/index) ；

官方推荐网站提供很好的思路；

react-use 的 useAsync 只针对异步函数的处理；

ahooks 的 useRequest 已经非常成熟，可以直接引入使用，但也在于功能过于强大，有点杀鸡用牛刀意思 😄；

借鉴以上的实现方案后，针对自己的业务项目 **定制** 更 **基础** 的异步数据请求 Hook 。

一开始的方案存在一些坑，经过不断的优化迭代，得到了本文最终的方案，仅供掘友参考。

![BCBAA8AC-3BAB-4C2E-8C11-D2E93975C7D9](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68b4938852844b4c8f2e6c33ddf2a51e~tplv-k3u1fbpfcp-zoom-1.image)

## Hook 需求

📌 首先我们要明确从 Hook 中获取什么

- **data**：请求结果；
- **loading**：用于表示正在请求数据；
- **run**：触发函数；
- **setData**：二次修改；（这个可以不需要返回）
- **error**：错误信息；（👀 大部分实现方案会以 isError 状态的形式抛出， 😎 由于我的项目对于错误进行了单独的处理，这里就不需要了）

📌 其次是提取 Hook 公共逻辑

- 接收异步请求函数
- 请求成功后回调函数
- 使用 try...catch 捕获错误
- 根据接口的返回的 isSuccess 字段判断

📌 最后使用 TS，类型推导

## Hook 技术方案

📂 services/api/../index.ts

```ts
/**
 * @description 查询
 * @export
 * @param {SearchProps} params
 * @returns {*}  {Promise<ResponseProps<ListProps>>}
 */
export async function apiSearch(params: SearchProps): Promise<ResponseProps<ListProps[]>> {
  const { data } = await http.get('/.../List', params);
  return data;
}
```

📌 封装异步请求函数，这样方便接口管理。

### 封装

📂 hooks\common\useRequest.ts

```ts
import { ResponseProps } from '@types';
import { useCallback, useState } from 'react';

interface UseRequestReturnType<P, T> {
  /**
   * @description service 返回的数据
   * @type {T}
   */
  data: T;
  /**
   * @description service 是否正在执行
   * @type {boolean}
   */
  loading: boolean;
  /**
   * @description 触发 service 执行，参数会传递给 service
   */
  run: (params: P) => void;
  /**
   * @description setData
   * @type {React.Dispatch<React.SetStateAction<T>>}
   */
  setData: React.Dispatch<React.SetStateAction<T>>;
}

// 初始数据
const initData: any = null;

/**
 * @description 异步数据请求的 Hook
 * @export
 * @template P 入参类型
 * @template T 出参类型
 * @param {(params: P) => Promise<ResponseProps<T>>} apiService service
 * @param {(result: T) => void} [onSuccess] service resolve 时触发 参数为 data
 * @returns {*}  {UseRequestReturnType}
 */
export function useRequest<P = any, T = any>(
  apiService: (params: P) => Promise<ResponseProps<T>>,
  onSuccess?: (result: T) => void,
): UseRequestReturnType<P, T> {
  const [data, setData] = useState<T>(initData);

  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (params) => {
      setLoading(true);

      try {
        const { isSuccess, result } = await apiService(params);
        if (isSuccess) {
          setData(result);

          // 处理 Modal 保存成功后，调用 hideModal()，组件销毁前先完成 loading state 更新
          // 避免 dev server Warning：Can't perform a React state update on an unmounted component.
          setLoading(false);

          onSuccess && onSuccess(result);
        }
      } catch (error) {
        // 错误信息由 services/request message.error() 抛出
        console.log(error);
      }

      setLoading(false);
    },
    [apiService, onSuccess],
  );

  return {
    data,
    loading,
    run,
    setData,
  };
}
```

📌 使用泛型传递类型参数，方便类型推导。

📌 这里使用了两次 `setLoading(false)` ，在 `onSuccess` 之前使用是因为，项目存在一种业务情况，在“保存完成”后关闭 Modal，但是`hideModal()` 是通过 `onSuccess` 调用的，所以在 Modal 关闭之后，再去更新 state，控制台就会报 Warning， React 会提醒开发者不要在卸载的组件执行状态更新。

📌 上面有提到项目对错误信息有统一处理，所以不需要抛出 error。

📌 返回值是以对象的形式，当然也可以像 State Hook 一样以数组的形式返回。其实也就是解构赋值语法对于数组和对象的区别，这里个人使用习惯。

- 解构数组：必须按顺序获取值，直接命名；
- 解构对象：必须使用返回对象对应的字段获取值，解构命名；

### 使用

📂 src/../component.tsx

```ts
import {
  //...
  useRequest,
} from 'hooks';

import {
  //...
  apiSearch,
  apiSave,
} from 'services/api';

//...

// 声明查询 request

// 不需要处理返回数据的情况，直接使用抛出的 data
const { data: dataList, run: runSearch, loading: searchBtnLoading } = useRequest(apiSearch);

// 需要处理返回数据的情况，在 onSuccess 里获取 result
const {
  run: runSearch,
  loading: searchBtnLoading,
  setData: setDataList,
} = useRequest(apiSearch, (result) => {
  // 处理出参
  const tmp = format(result);
  setDataList(tmp);
});

// 声明保存 request
const { loading: saveBtnLoading, run: runSave } = useRequest(apiSave, () => {
  //...
  message.success('保存成功');
});

// 查询
const onSearch = () => {
  // 处理入参
  //...
  runSearch(params);
};

// 保存
const onSave = () => {
  // 处理入参
  //...
  runSave(params);
};
```

📌 params ，result 都会有类型校验，这里也就体现出用 ts 的好处了。

## 总结

大功告成 🎉 这样就可以 Hook 的方式去进行数据请求了。不用 CV 重复的代码，代码结构也更 **prettier** 😄。

我认为 🧐 使用 Hook 熟练程度，在于 Custom Hook 玩的溜不溜，体现在对业务项目能够巧妙定制 Hook。

还记得在最开始学习 Hook 的时候，看到大佬们自定义的 Hook 后发出，卧槽，原来是这么玩的 😆。目前社区已经有很多成熟的自定义 Hook 方案，比如 [react-use](https://github.com/streamich/react-use) 、[ahooks](https://ahooks.js.org/) 等等，大家有推荐的 Hook 开源库，也希望可以在评论区分享下，毕竟看优秀的代码也是学习的过程 🏃。

这篇文章以我项目中自定义 Hook 的方案作为分享，有任何优化建议或者问题欢迎各位大佬评论区指出。

如果本文的方案对你有些许帮助&启发，那就拜托点个赞吧 👍 🙇🏻🙇🏻🙇🏻
