# 远程唤醒连接 Mac 💻

## 需求

当您的 Mac 不在身边的时候，您需要远程控制 Mac ，我们一般会用远程控制 App 实现，但电脑不一定处于唤醒状态，导致我们无法直接远程控制。所以我们需要先唤醒后才能通过 App 控制。

## 方案

**前提**

- macOS：Ventura 13.x
- 远程控制软件：ToDesk 4.x（个人习惯）
- Mac 处于“睡眠 + Wi-Fi + ToDesk 后台运行” 状态

### Plan A - 查找 + ToDesk

1.打开 iPhone 查找 App，等待大概 10s 设备状态刷新成“位置·现在” 即可；

<img src="https://cdn.jsdelivr.net/gh/Jinyangava/blog-image@master/img/image-20230223213217108.png" alt="image-20230223213217108" style="zoom:25%;" />

2.然后打开 ToDesk 设备列表，就可以看见当前 Mac 处于在线状态 🟢，直接点击后远程控制即可；

<img src="https://cdn.jsdelivr.net/gh/Jinyangava/blog-image@master/img/67ee2df8c0ddc1ec231eef28b381fc20.png" alt="67ee2df8c0ddc1ec231eef28b381fc20" style="zoom:25%;" />

### Plan B - pmset 命令 + ToDesk

1.打开 Mac 上的“终端” App，输入 pmset 命令，按下 Return 键。

例如：如果您想要将 Mac 设置为在工作日早上 9 点唤醒：

```
sudo pmset repeat wake MTWRF 09:00:00
```

::: tip
Monday: M; Tuesday: T; Wednesday: W; Thursday: R; Friday: F; Saturday: S; Sunday: U.
:::

2.通过远程控制即可；

**其他 pmset 命令**

查看当前定时：

```
pmset -g sched：
```

取消当前定时：

```
sudo pmset repeat cancel
```

**缺点：没有主动权，固定时间唤醒**

## 总结

除了以上方案，还有其他硬核方案，比如物理开机机器人、Mac 永不关闭显示屏等等，成本较高，这里就不推荐了。

目前推荐使用的方案是“查找 + ToDesk”，实测使用几个月来没有出现任何问题，而且非常方便实用，只是偶尔因为网络波动原因，查找设备更新状态慢了点。

## 参考

> https://support.apple.com/zh-cn/guide/mac-help/mchl40376151/13.0/mac/13.0
>
> https://www.makeuseof.com/how-to-schedule-startup-shutdown-restart-mac
