---
layout: post
category: 开发
tags: [Node.js]
title: Node 中的流（Stream）
---

朴(piáo)老湿的九浅一深 Node.js 貌似没有详细介绍 [Stream](http://nodeapi.ucdok.com/api/stream.html) 模块。自己对这个模块算是比较熟悉，顺手也 PO 上来备忘一下吧。

## 又是废话

如果说 Activity、Service、Content Provider 和 Broadcast Receiver 并称 Android 四大组件的话，那么 Node 的「N 大模块」里面必定要有 Stream。

类似于 *nix 将几乎所有设备抽象为文件一样，Node 将几乎所有 IO 操作都抽象成了 Stream 的操作。Stream 是一个抽象的概念，总之就是会冒数据（以 Buffer 为单位），或者能够吸收数据的东西。

## 为什么需要 Stream 呢？

在 Node 里读取一个文件的内容：

```js
var fs = require('fs')

fs.readFile('/etc/hosts', function (err, buffer) {
  if (err) {
    return console.error(err.stack)
  }

  console.log(buffer.toString('utf8'))
})
```

对于大文件操作，一口气全部读入内存肯定是不行的，科学的做法是一份一份地读：

```js
var fs = require('fs')

fs.open('/etc/hosts', 'r', function (err, fd) {
  if (err) {
    return console.error(err.stack)
  }

  // 内啥，我想演示一下用 fs.read 逐片逐片读文件的，但那玩意实在太烦，
  // 所以我懒得写了。自己看文档。
})
```

很烦对吧？每次读多少？这些往往不是我们需要关心的，于是就有了 Stream。Node 对这种传统的读取过程隐藏到了文件读取 Stream 中：

```js
var fs = require('fs')
fs.createReadStream('/etc/hosts').pipe(process.stdout)
```

没错，就两行代码，将 hosts 文件的内容显示出来。

## 以前的 Stream

在 Node 的早期版本中，Stream 只是一个简单的继承自 EventEmitter 的类。以文件读取流为例子，一旦开始读取，数据就会源源不断地读出，触发 `'data'` 事件——嗯一开始的确是一个不错的设计，但如果你想等一下，比如说等待某个回调后再开始处理这些数据。。。好吧，每一片数据只会冒出来一次，没人消费的话它就没了；OK 你想到了用 [pause-stream](https://github.com/dominictarr/pause-stream)「暂停」一下这个流，等下再消费？完了，数据会暂存在内存中，慢慢堆积，然后，你懂了。

## 现在的 Stream

当然并不是说原来不断冒 `'data'` 的读取方式是不好的，只是说它对于某些情景，比如文件读取，比如网络传输，没办法控制读取速度而已。网络传输注定是没办法控制读取速度的，人家给你多少你都得吃进去；但文件读取，能不能按需要，处理多少读多少呢？

Node 0.10.X 就对 Stream 做了这样的改动：默认情况下，Node 会尽可能使用「拉」模式，也就是说只有 pipe 链末端的流消费者真正需要数据的时候，数据才会从源头被取出，然后顺着管子一路到达消费者。

## 这样我就可以把管子插……

Stream 的精髓在于 `.pipe()` 嗯。

### 下载文件？So easy

推荐一个牛逼哄哄的库：[request](https://github.com/mikeal/request)，Stream API 运用到极致的 HTTP(S) 请求库。

```js
var fs = require('fs')
  , request = require('request')

var writer = fs.createWriteStream('hexie.pkg')
// 'close' 和 'error' 事件分别是写入完成和发生错误，懒得写，看文档。

request('http://xxxxxxx.xxx/abs123.avi').pipe(writer)
```

`fs.createWriteStream()` 创建了一个新文件并返回了该文件的 Writable Stream；`request()` 发起了一个 HTTP 请求并返回一个 Readable Stream。将这两个 Stream 通过 `.pipe()` 一对接，`request()` 的下载流量就被直接导到本地文件并写入磁盘，神奇吧？

### 模拟 HTML POST 表单上传也是 So easy

推荐一下朴老湿好基友苏千大神（[@Python发烧友](http://weibo.com/81715239)）的 [formstream](https://github.com/fengmk2/formstream)，配合 request 简直碉堡。

```js
var request = require('request')
  , FormStream = require('formstream')

var form = FormStream()
  .field('title', 'ni dong de')
  .file('attachment', 'hexie.pkg')

var upload = request.post('http://xxxx.xxx/upload', {
  headers: form.headers()
}, function (err, res, body) {
  // ... 略
})

form.pipe(upload)
```

## 最后，还是废话

最后，最后，还得感谢老雷（[@雷宗民](http://weibo.com/ucdok)）的 [Node.js API 翻译计划](http://nodeapi.ucdok.com/)，俺就是翻译完 Stream 章节才理解上面这些精髓的。

以上。

> 原载于 [Segmentfault](http://segmentfault.com/blog/xingrz/1190000000357044)，自己搬运。
