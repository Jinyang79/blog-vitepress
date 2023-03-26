# Redux Toolkit 使用技巧

## 前言

Hi，今天和大家分享一些关于使用 Redux Toolkit 的小技巧。

[Redux Toolkit](https://redux-toolkit.js.org/) 是一个官方推荐的 Redux 工具集，它可以帮助我们更快捷、更方便地进行 Redux 开发。

很多同学在使用 RTK 与 Typescript 的时候，可能会遇到一些问题，比如代码重复编写、类型不必要的显示声明等等。

本文将会分享几个日常开发中使用 RTK 的小技巧，帮助大家减少代码量，使代码更加简洁，提高代码质量。

希望对你使用 RTK 有所帮助，如果有更好的方案，也欢迎大家在评论区分享自己对 RTK 的使用经验。


::: tip
项目遵循 [Redux Style Guide](https://redux.js.org/style-guide/) 开发

相关 dependencies:

`"@reduxjs/toolkit": "^1.9.3",`

`"react": "^18.2.0",`

`"typescript": "^4.6.0",`

:::



## 提取 sliceName

创建切片的时候，使用变量指定 slice name，生成 action 类型将会使用它作为前缀。

这样，当我们在应用中使用 dispatch 触发 action 时，就可以通过 action 类型中的 slice 名称来区分不同的 reducer 函数。并且使代码更加清晰易懂，方便管理。

### before

::: code-group

```ts [features/todos/todosSlice.ts]
export const getTodoData = createAsyncThunk(
  `todos/getTodoList`,  // [!code hl] 
  async (params) => {
    //...
  },
);

export const postTodoItem =
  `todos/postTodoItem`, // [!code hl] 
  async (params) => {
    //...
  },
);

// more createAsyncThunk ...

const todosSlice = createSlice({
  name: 'todos', // [!code hl] 
  initialState,
  reducers: { //... },
  extraReducers: (builder) => { //... },
});
```

:::

### after

::: code-group

```ts [features/todos/todosSlice.ts]
const sliceName = 'todos';  // [!code focus] 

export const getTodoList = createAsyncThunk(
  `${sliceName}/getTodoList`, // [!code focus] 
  async (params) => {
    //...
  },
);

export const postTodoItem = createAsyncThunk(
  `${sliceName}/postTodoItem`,  // [!code focus] 
  async (params) => {
    //...
  },
);

// 更多的 createAsyncThunk ...

const todosSlice = createSlice({
  name: sliceName,  // [!code focus] 
  initialState,
  reducers: { //... },
  extraReducers: (builder) => { //... },
});
```

:::

## 提取 selector function

在组件中使用 `useSelector` hook 从 store 读取数据，它会接受一个选择器函数，我们可以在 slice 文件里提前声明选择器函数。

比如：将 `state => state.todos` 选择器函数从组件中提取出来，声明为 `selectTodos` ，使得它可以在其他组件中重复使用，避免了代码的重复编写。同时也使得组件的代码更加简洁清晰。

### before

::: code-group

```ts [features/todos/Todos.ts]
import { useAppSelector, useAppDispatch } from 'app/hooks'

export function Todos() {
  const { todoList } = = useAppSelector(state => state.todos) // [!code hl] 

  return (
    // omit rendering logic
   )
}
```

:::

### after

::: code-group

```ts [features/todos/todosSlice.ts]
// omit createSlice

export const selectTodos = (state: RootState) => state.todos; // [!code focus] 

export default todoSlice.reducer;
```

```ts [features/todos/Todos.ts]
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { selectTodos } from './todosSlice';

export function Todos() {
  const { todoList } = useAppSelector(selectTodos) // [!code focus] 

   return (
    // omit rendering logic
   )
}
```


:::


## 定义 createAsyncThunk 类型

当我们使用 createAsyncThunk 的第二个参数 payloadCreator 回调函数里的第二个参数时，使用 `thunkAPI.getState` 获取数据的时候，TS 类型检查会报 ERROR：`类型“unknown”上不存在属性“todos”`

::: code-group

```ts [features/todos/todosSlice.ts]
export const deleteTodoItem = createAsyncThunk(
  `${sliceName}/deleteTodoItem`,
  async (_, thunkAPI) => {
    const { todos } = thunkAPI.getState(); // [!code error] // Property 'todos' does not exist on type 'unknown'.ts(2339)

    const { result } = await apiDeleteTodo(todos.id);

    return result;
  },
);
```

:::

让我们在 `createAsyncThunk.d.ts` 看下 thunkAPI 类型定义

::: code-group

```ts [node_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts]
export declare type AsyncThunkPayloadCreator<
  Returned,
  ThunkArg = void,
  ThunkApiConfig extends AsyncThunkConfig = {}, // [!code focus] 
> = (
  arg: ThunkArg,
  thunkAPI: GetThunkAPI<ThunkApiConfig>,
) => AsyncThunkPayloadCreatorReturnValue<Returned, ThunkApiConfig>;

type AsyncThunkConfig = { // [!code focus:18] 
  /** return type for `thunkApi.getState` */
  state?: unknown;
  /** type for `thunkApi.dispatch` */
  dispatch?: Dispatch;
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown;
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: unknown;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown;
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown;
};
```

:::

我们可以看见除了 `dispatch` 定义了具体类型 `Dispatch`，其他都是 `unknown | undefined` 。

所以如果你想从 payloadCreator 中使用它们，需要显示定义 thunkApi 泛型参数，因为这些参数的类型无法推断出来。

此外，**由于 TS 无法混合显式和推断泛型参数**，还需要定义 payloadCreator 的 Return type 和 First argument 泛型参数。

比如：你可以传入泛型参数 `<boolean, void, { state: RootState }> `

::: code-group

```ts [features/todos/todosSlice.ts]
export const deleteTodoItem = createAsyncThunk<
  boolean, // [!code focus:3] 
  void,
  { state: RootState }
>(`${sliceName}/deleteTodoItem`, async (_, { getState }) => {
  const { todos } = getState();

  const { result } = await apiDeleteTodo(todos.id);

  return result;
});
```
:::

如果你觉得这样写很麻烦，**因为 TypeScript 可以推断出 Return type 和 First argument 类型**，那么我们只需要显式定义 thunkApi.getState 方法的类型即可，**无需再显式定义这两个类型**。

为了解决这个问题，我们可以使用 Type Assertions 中的 `as` 关键字，从而避免了重复定义类型。

::: code-group

```ts [features/todos/todosSlice.ts]
// or // [!code focus] 
export const deleteTodoItem = createAsyncThunk(
  `${sliceName}/deleteTodoItem`,
  async (_, { getState }) => {
    const { todos } = getState() as RootState; // [!code focus] 
    const { result } = await apiDeleteTodo(todos.id);

    return result;
  },
);
```

:::

如果你觉得这样就解决了问题，那么当你每次调用大量的 createAsyncThunk 时，会发现每次显式声明类型都很麻烦，这应该由 TypeScript 类型推断来完成。

作为开发者，我们应该尽可能的**避免强制转换类型**，因为这正是 TypeScript 的使用意义之一，让语言自动推断类型，同时也避免了循环依赖的问题。

因此，我们可以使用 TypeScript 的[模组扩充](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)来解决这个问题。通过使用模块增强功能，我们可以将默认状态分配给 AsyncThunkConfig.state，这样在稍后调用 `getState()` 时就能返回正确的类型。

::: code-group

```ts [app/store.ts]
import { AsyncThunk, AsyncThunkOptions, AsyncThunkPayloadCreator, Dispatch } from '@reduxjs/toolkit';

// omit configureStore

declare module "@reduxjs/toolkit" {
    type AsyncThunkConfig = {
        state?: unknown;
        dispatch?: Dispatch;
        extra?: unknown;
        rejectValue?: unknown;
        serializedErrorType?: unknown;
    };

    function createAsyncThunk<
        Returned,
        ThunkArg = void,
        ThunkApiConfig extends AsyncThunkConfig = { state: RootState } // here is the magic line
    >(
        typePrefix: string,
        payloadCreator: AsyncThunkPayloadCreator<
            Returned,
            ThunkArg,
            ThunkApiConfig
        >,
        options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>,
    ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
}

export default store;
```

:::

这样就不需要使用 `createAsyncThunk` 去显式声明类型。

这是 RTK 1.9 之前的解决办法，Redux 官方也注意到这一点，于是提供了 `createAsyncThunk.withTypes<>()`

## 定义预类型 `createAsyncThunk`

从RTK 1.9开始，你可以调用 `createAsyncThunk.withTypes<>()` 并传入一个包含 AsyncThunkConfig 中任何字段的字段名和类型的对象。

这让你可以**一次设置这些类型**，从而无需在每次调用 createAsyncThunk 时**重复定义**它们。


**usage:**

::: code-group

```ts [app/store.util.ts]
const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  // other fields type
}>();
```

```ts [features/todos/todosSlice.ts]
export const deleteTodoItem = createAsyncThunk(
  `${sliceName}/deleteTodoItem`,
  async (_, { getState }) => {
    const { todos } = getState();
    const { result } = await apiDeleteTodo(todos.id);

    return result;
  },
);
```

:::

这样代码看起来就简洁多了 😎

## 使用 addMatcher 处理重复状态修改

简单回顾下用法：

`builder.addCase`: 处理**单个精确**的 action type。

`builder.addMatcher`: 根据传入的第一个参数（匹配器函数），处理**函数匹配**的 action type。

::: tip
所有 builder.addMatcher 的调用都必须放在任何 builder.addCase 之后调用
:::


接下来，举一个例子：

当我们在获取 TodoList 发起异步请求时

`'todos/getTodoList'` 将生成这些 action types:

- pending: `'todos/getTodoList/pending'`
- fulfilled: `'todos/getTodoList/fulfilled'`
- rejected: `'todos/getTodoList/rejected'`

我们需要在 pending 阶段将 `loading` 状态改成 `true`，fulfilled 和 rejected 将 `loading` 状态改成 `false`。

### 使用 addCase

::: code-group

```ts [features/todos/todosSlice.ts]
export const getTodoList = createAppAsyncThunk(
  `${sliceName}/getTodoList`,
  async () => {
    const { result } = await apiGetTodoList();
    return result;
  }
);

export const postTodoItem = createAppAsyncThunk(/* omit logic */);

export const putTodoItem = createAppAsyncThunk(/* omit logic */);

export const deleteTodoItem = createAppAsyncThunk(/* omit logic */);

export const todosSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {/* omit */},
  extraReducers: (builder) => {
    builder
      .addCase(getTodoList.pending, (state) => { // [!code hl:3]
        state.loading = true; 
      })
      .addCase(getTodoList.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(getTodoList.rejected, (state) => { // [!code hl:3]
        state.loading = false;
      })

      .addCase(postTodoItem.pending, (state) => { // [!code hl:3]
        state.loading = true;
      })
      .addCase(postTodoItem.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(postTodoItem.rejected, (state) => { // [!code hl:3]
        state.loading = false;
      })

      .addCase(putTodoItem.pending, (state) => { // [!code hl:3]
        state.loading = true;
      })
      .addCase(putTodoItem.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(putTodoItem.rejected, (state) => { // [!code hl:3]
        state.loading = false;
      })

      .addCase(deleteTodoItem.pending, (state) => { // [!code hl:3]
        state.loading = true;
      })
      .addCase(deleteTodoItem.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(deleteTodoItem.rejected, (state) => { // [!code hl:3]
        state.loading = false;
      })
  },
});
```

:::

可以从代码高亮看见，我们在所有 action type 的 pending, fulfilled 和 rejected 阶段，都对 `state.loading` 进行了状态修改，导致存在大量重复状态修改代码。

这里我们就可以使用 `addMatcher` 来匹配相同的阶段，并创建 `isPendingAction`, `isFulfilledAction`, `isRejectedAction` 三个 matcher function 来处理。


### 使用 addMatcher

::: code-group

```ts [features/todos/todosSlice.ts]
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isPendingAction, isFulfilledAction, isRejectedAction } from 'app/store.util';

export const todosSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // omit
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodoList.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(postTodoItem.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(putTodoItem.fulfilled, (state, action) => (/* omit success logic */);
      .addCase(deleteTodoItem.fulfilled, (state, action) => (/* omit success logic */);
      .addMatcher(isPendingAction, (state) => { // [!code focus:6] 
        state.loading = true;
      })
      .addMatcher(isFulfilledAction || isRejectedAction, (state) => {
        state.loading = false;
      });
  },
});
```

```ts [app/store.util.ts]
import { AnyAction } from '@reduxjs/toolkit';

export const isPendingAction = (action: AnyAction) => action.type.endsWith('/pending');
export const isFulfilledAction = (action: AnyAction) => action.type.endsWith('/fulfilled');
export const isRejectedAction = (action: AnyAction) => action.type.endsWith('/rejected');
```

:::

这样代码是不是就清晰多了 😎

## 最后

希望对你使用 RTK 有所帮助，如果有更好的方案，也欢迎大家在评论区分享自己对 RTK 的使用经验。

## 参考

> https://redux-toolkit.js.org/
>
> https://github.com/Tencent/tdesign-react-starter
>
> https://stackoverflow.com/questions/64793504/cannot-set-getstate-type-to-rootstate-in-createasyncthunk
>
> https://github.com/reduxjs/redux-toolkit/issues/486
