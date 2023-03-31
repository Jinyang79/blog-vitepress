```
{
  strings: [], // 要打字的字符串数组
  stringsElement: null, // 包含字符串子元素的元素的 ID
  typeSpeed: 0, // 打字速度，以毫秒为单位
  startDelay: 0, // 打字前的延迟时间，以毫秒为单位
  backSpeed: 0, // 回退速度，以毫秒为单位
  smartBackspace: true, // 只回退与前一个字符串不匹配的部分
  shuffle: false, // 是否打乱字符串
  backDelay: 700, // 回退前的等待时间，以毫秒为单位
  fadeOut: false, // 是否淡出而不是回退
  fadeOutClass: 'typed-fade-out', // 淡出动画的 CSS 类
  fadeOutDelay: 500, // 淡出延迟时间，以毫秒为单位
  loop: false, // 是否循环字符串
  loopCount: Infinity, // 循环次数
  showCursor: true, // 是否显示光标
  cursorChar: '|', // 光标字符
  autoInsertCss: true, // 是否将 CSS 插入到 HTML <head> 中
  attr: null, // 用于打字的属性，例如输入占位符、值或 HTML 文本
  bindInputFocusEvents: false, // 如果元素是文本输入，则绑定到焦点和模糊
  contentType: 'html', // 内容类型，'html' 或 'null' 表示纯文本
  onBegin: (self) => {}, // 开始打字前
  onComplete: (self) => {}, // 所有打字完成后
  preStringTyped: (arrayPos, self) => {}, // 每个字符串打字前
  onStringTyped: (arrayPos, self) => {}, // 每个字符串打字后
  onLastStringBackspaced: (self) => {}, // 循环时，在最后一个字符串被删除后
  onTypingPaused: (arrayPos, self) => {}, // 打字被暂停时
  onTypingResumed: (arrayPos, self) => {}, // 打字被恢复后
  onReset: (self) => {}, // 重置后
  onStop: (arrayPos, self) => {}, // 停止打字后
  onStart: (arrayPos, self) => {}, // 开始打字后
  onDestroy: (self) => {}, // 销毁后
}
```