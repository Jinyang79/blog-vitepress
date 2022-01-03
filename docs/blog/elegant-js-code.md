# 更优雅的 js 代码

持续更新中...

## 变量命名

要写出好代码，变量命名至关重要。我们尽量采用富有表现力的词，英文不好多用翻译软件，保证不出现错误单词。编辑器可以安装相关的拼写检查、翻译插件。

1. 不要缩写/简写单词，除非这些单词已经公认可以被这样缩写/简写。这样做导致可读性下降，意义表达不明确。反例：`Association ass` 、`StringBuilder sb`
2. 普通变量命名则使用名词及名词短语。比如 `value`、`options`、`fileText`、`columnName` 等
3. boolean 命名，如果表示“是不是”用 `is...`，表示“有没有”用 `has...`，表示“能不能”用`can...`，表示“能不能怎么样”用 `...able`
4. function 命名采用动词/宾语顺序。比如 `getUserInfo`、`insertRows`、`clearValue` 等
5. 避免使用 `_` 开头、`temp`、`my` 之类命名临时变量，临时变量也是有意义的，这些都会增加阅读代码时的噪点
6. 避免无意义的命名，你起的每一个名字都要能表明意思。比如`userInfo`、`clickCount` 反例 `info` 、`count`

## 提前返回

在 `function` 中经常会遇到变量值为 `undefined` 的情况，这个时候则需要提前判断并阻止执行，避免一些不必要的分支（无 `else`），让代码更精炼。

```js
if (userInfo) {
  // 执行业务逻辑
} else {
  return;
}
```

提前返回：

```js
if (!userInfo) {
  return;
}

// 执行业务逻辑
```

## 可选链操作符( **`?.`** )

如果我们有一个这样的对象：

```js
const parent = {
  child: {
    child1: {
      child2: {
        key: 10,
      },
    },
  },
};
```

很多时候我们会这样去写，避免某一层级不存在导致报错：

```js
parent && parent.child && parent.child.child1 && parent.child.child1.child2;
```

这样代码看起来就会很臃肿，可以使用可选链运算符( **`?.`** )：

```js
parent?.child?.child1?.child2;
```

这样实现和效果和上面的一大长串是一样的。

可选链运算符同样适用于数组：

```js
const array = [1, 2, 3];
array?.[5];
```

可选链运算符允许我们读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用是否有效。在引用为空(`null` 或者 `undefined`) 的情况下不会引起错误，该表达式短路返回值是 `undefined`。与函数调用一起使用时，如果给定的函数不存在，则返回 `undefined`。

## 空值合并运算符（**`??`**）

如果有这样一段代码：

```js
if (a === null || a === undefined) {
  doSomething();
}
```

也就是如果需要验证一个值如果等于`null`或者`undefined`时，需要执行一个操作时，可以使用空值合并运算符来简化上面的代码：

```js
a ?? doSomething();
```

这样，只有 a 是`null`或者`undefined`时，才会执行控制合并运算符后面的代码。空值合并运算符（**`??`**）是一个逻辑操作符，当左侧的操作数为`null`或者`undefined`时，返回其右侧操作数，否则返回左侧操作数。

## 条件判断

简单的判断 `if + return` 就提前返回了。复杂逻辑 `if else if` 面条式代码不够优雅，想用 `switch case`？实际情况看来 `if else` 和 `switch case` 用法区别不大。

```js
// if else
if (status == 1) {
  console.log("processing");
} else if (status == 2) {
  console.log("fail");
} else if (status == 3) {
  console.log("success");
} else if (status == 4) {
  console.log("cancel");
} else {
  console.log("other");
}

// switch case
switch (status) {
  case 1:
    console.log("processing");
    break;
  case 2:
    console.log("fail");
    break;
  case 3:
    console.log("success");
    break;
  case 4:
    console.log("cancel");
    break;
  default:
    console.log("other");
    break;
}
```

在上面代码中可以看出 `switch case` 比 `if else` 代码行数还多，`break` 关键字也是必不可少，还不忘写 `default`。这里我们推荐用 `Object` 或 `Map` 作为条件存储。

```js
const actions = {
  1: "processing",
  2: "fail",
  3: "success",
  4: "cancel",
  default: "other",
};

console.log(actions[status] ?? actions.default);
```

`Map` 则更为强大，`Object` 的键必须是一个`String` 或是`Symbol`，但 Map 的键可以是**任意值**，包括函数、对象或任意基本类型。

```js
const actions = new Map([
  [1, 'processing'],
  [2, 'fail'],
  [3, 'success'],
  [4, 'cancel'],
  [0, 'other'],
]);

console.log(actions.get(status) ?? actions.get(0)));
```

## 使用逻辑运算符

如果有一段这样的代码：

```js
if (a > 10) {
  doSomething(a);
}
```

可以使用逻辑运算符来改写：

```js
a > 10 && doSomething(a);
```

这样写就会简洁很多，如果逻辑与`&&`操作符前面的值为假，就会发生短路操作，直接结束这一句的执行；如果为真，就会继续执行`&&`后面的代码，并返回后面代码的返回值。使用这种方式可以减少很多`if...else`判断。

## 判断简化

如果有下面的这样的一个判断：

```js
if (a === undefined || a === 10 || a === 15 || a === null) {
  //...
}
```

就可以使用数组来简化这个判断逻辑：

```js
if ([undefined, 10, 15, null].includes(a)) {
  //...
}
```

这样代码就会简洁很多，并且便于扩展，如果还有需要等于 a 的判断，直接在数组中添加即可。

## 函数参数

如果当函数参数大于两个，就可以考虑使用对象的形式来传递参数，而不是参数列表。

对象的形式传递参数时，传递可选参数并不需要放在最后，并且参数的顺序不在重要。与参数列表相比，通过对象传递的内容也更容易阅读和理解。

下面来看一个例子：

```js
function getUserInfo(name, age, sex, Address, phone) {
  //...
}

getUserInfo("小明", 24, "男", undefined, "1388888");
```

下面来使用对象传参：

```js
function getUserInfo(args) {
  const { name, age, sex, Address, phone } = args;
  //...
}

getUserInfo({
  phone: "1388888",
  sex: "bananas",
  age: 10,
  name: 1,
});
```

## 参考

> <https://github.com/airbnb/javascript>
>
> <https://mp.weixin.qq.com/s/bi2spjQh8s-Qel1LREOeFg>
>
> <https://mp.weixin.qq.com/s/FzAyEBz3Qs5qoVG04UOvFg>
