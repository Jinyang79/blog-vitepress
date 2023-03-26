# React 中使用 SignalR

## 前言

当遇到服务器需要**实时**地**主动**向客户端推送数据的需求时，可以通过 WebSocket 协议实现，如果服务器采用 .NET 框架，我们就可以使用微软官方提供 SignalR 技术。

本文将演示如何在 React 项目如何使用 SignalR，并通过自定义 hook 来简化使用。

### 简单介绍下 SignalR

[ASP.NET Core SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-7.0) 是一个库，可用于简化向应用添加实时 Web 功能，让服务器端代码能够将内容推送到客户端。

SignalR 支持以下用于处理实时通信的技术（按正常回退的顺序）：

- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- Long Polling

SignalR **自动选择**服务器和客户端能力范围内的最佳传输方法。

也就是说：当 WebSockets 可用时，SignalR 将在底层使用 WebSockets，而当不可用时，它会优雅地回退到其他技术，同时保持应用程序代码不变。

HttpTransportType 枚举如下：

```typescript
export declare enum HttpTransportType {
  /** Specifies no transport preference. */
  None = 0,
  /** Specifies the WebSockets transport. */
  WebSockets = 1,
  /** Specifies the Server-Sent Events transport. */
  ServerSentEvents = 2,
  /** Specifies the Long Polling transport. */
  LongPolling = 4,
}
```

可以通过 HubConnectionBuilder 实例提供的 [withUrl(string, HttpTransportType)](https://learn.microsoft.com/en-us/javascript/api/@microsoft/signalr/hubconnectionbuilder?view=signalr-js-latest#@microsoft-signalr-hubconnectionbuilder-withurl-1) 方法指定传输协议。
比如：`.withUrl(hubUrl,signalR.HttpTransportType.WebSockets)`

## 实现

### Install

```bash
yarn add @microsoft/signalr
```

### Usage

1. **创建实例**：在组件挂载时，使用 HubConnectionBuilder 类，创建 HubConnection 实例；
2. **建立连接**：使用实例上的 `start()` 方法启动 SignalR 连接，返回的是一个 `Promise<void>` 所以可以做一些连接成功后续操作；
3. **监听事件**：使用实例上的 `on(string, (args: any[]) => void)` 方法来监听服务器上的事件，第一个参数是订阅的事件名称，第二个参数是回调函数，用于处理接收到的消息；
4. **断开连接**：在组件卸载时，使用实例上的 `stop()` 方法断开 SignalR 连接，返回的是一个 `Promise<void>` 所以可以做一些断开连接后续操作；

::: tip
SignalR 连接可能会因多种原因中断（网络问题，服务器故障，客户端脚本错误或内存泄漏等等）。

可以通过 HubConnectionBuilder 的 `withAutomaticReconnect()` 方法，在连接丢失时自动尝试重新连接。

默认情况下，客户端将分别等待 0、2、10 和 30 秒，然后尝试 4 次重新连接尝试。

:::

实现源码：

```tsx
import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import urls from 'services/urls';
import { useMount } from 'hooks';

export default function MyComponent() {
  const [hubConnection, setHubConnection] =
    useState<signalR.HubConnection | null>(null);

  useMount(() => {
    // 1.组件挂载时，创建 HubConnection 实例
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(urls.hubUrl)
      .withAutomaticReconnect() // 自动重连
      .build();

    setHubConnection(newConnection);
  });

  useEffect(() => {
    // 2.启动 SignalR 连接
    if (hubConnection) {
      hubConnection
        .start()
        .then(() => {
          console.log('SignalR Connected!');
        })
        .catch((err) => {
          console.log('SignalR Connection Error: ', err);
        });
    }

    return () => {
      // 4.组件卸载时，断开 SignalR 连接
      if (hubConnection) {
        hubConnection
          .stop()
          .then(() => {
            console.log('SignalR Disconnected!');
          })
          .catch((err) => {
            console.log('SignalR Disconnection Error: ', err);
          });
      }
    };
  }, [hubConnection]);

  // 3.使用 hub 的 on 方法来监听服务器上的事件
  hubConnection?.on('ReceiveMessage', (data) => {
    console.log(`ReceiveMessage: ${data}`);
    // omit logic
  });

  return (
    <div>
      <h1>SignalR Example</h1>
    </div>
  );
}
```

### useSignalR

使用自定义 hook 封装 SignalR 可以使代码更加简洁和可复用。

```tsx
import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Urls } from 'types';
import { useMount } from 'hooks';

export default function useSignalR(hubUrl: Urls) {
  const [hubConnection, setHubConnection] =
    useState<signalR.HubConnection | null>(null);

  useMount(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(urls.hubUrl)
      .withAutomaticReconnect()
      .build();

    setHubConnection(newConnection);
  });

  useEffect(() => {
    if (hubConnection) {
      hubConnection
        .start()
        .then(() => {
          console.log('SignalR Connected!');
        })
        .catch((err) => {
          console.log('SignalR Connection Error: ', err);
        });
    }

    return () => {
      if (hubConnection) {
        hubConnection
          .stop()
          .then(() => {
            console.log('SignalR Disconnected!');
          })
          .catch((err) => {
            console.log('SignalR Disconnection Error: ', err);
          });
      }
    };
  }, [hubConnection]);

  return hubConnection;
}
```

使用 useSignalR hook

```tsx
import useSignalR from './hook';
import urls from 'services/urls';

export default function MyComponent() {
  const hubConnection = useSignalR(urls.hubUrl);

  // 使用 hubConnection.on 方法进行事件监听
  hubConnection?.on('ReceiveMessage', (data) => {
    console.log(`ReceiveMessage: ${data}`);
    // omit logic
  });
   return (
    // omit rendering logic
   )
}
```

## 参考

> https://dotnet.microsoft.com/en-us/apps/aspnet/signalr
>
> https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
>
> https://medium.com/swlh/creating-a-simple-real-time-chat-with-net-core-reactjs-and-signalr-6367dcadd2c6
