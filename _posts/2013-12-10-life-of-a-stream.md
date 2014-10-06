---
layout: post
category: 开发
tags: [Node.js]
title: 一个 HTTP 请求的一生
---

今天刚看完 [@朴(piáo)灵](http://weibo.com/shyvo) 大神的「九浅一深 Node.js」的网络编程部分，结合自己的理解，以 [Express](http://expressjs.com/) 为例总结一下 HTTP 服务器的机制。

引用一下[之前在这里的一个回答](http://segmentfault.com/q/1010000000328812/a-1020000000329332)嗯：

> Express 框架的 API，说白了就是钩子链。
>
> ```js
> app.use([path, ]hook)
> ```
>
> ```js
> app.get(path[, hook1, hook2, hook3, ...], handler)
> ```
> 任何一个钩子，只要调用了 `res.end()`（或者 `res.send()`、`res.render()` 之类最终会调用 `res.end()` 的方法）后，就将内容返回给用户，中断后续的钩子；如果调用 `next()` 则把请求传递给下一个钩子，一直传递到最后的 `handler`。
>
> ```js
> app.use(function (req, res, next) {
>   // I'm hook 1, I won't do anything.
>   next()
> })
>
> app.use(function (req, res, next) {
>   // I'm hook 2, I'll break the chain
>   res.send('Oops! Broke at hook 2')
> })
>
> app.get('/', function (req, res) {
>   // Handler for path /
>   // We responsed the user at hook 2,
>   // so requests would never reach this handler
>   res.send('You\'ll never see this')
> })
> ```

从前，有一个寂寞的 Express 实例，它在那里等呀等，等呀等。。。

突然，有一个人类，在浏览器输入了一个网址，潇洒一拍回车。然后，这个访问请求，经过茫茫的互联网，到达了这个寂寞的 Express 实例所在的服务器。。。

这个请求（一坨数据，嗯它走的是一个 TCP 连接），首先进入了 Node.js 的内核，经过 [net](http://nodeapi.ucdok.com/api/net.html) 模块，被包装成一个特殊的 [Stream](http://nodeapi.ucdok.com/api/stream.html)。此时，它和其它 TCP 请求一样，只是一坨二进制数据，没人看得懂它是什么意思。

随后，这个 Stream 到达了 [http](http://nodeapi.ucdok.com/api/http.html) 模块。在这里，这条普通又不平凡的 TCP 数据流终于被解析出了 HTTP Header 并作为属性记录到了这个 Stream 中，从此它作为一个 HTTP 请求的生命就有了意义（喂！）。。。

当然，这些信息对于一个成熟的 Web 服务是远远不够的。于是，Express 脱好裤子（喂！够了）等着了！

Stream 在 Express 的身体里流啊流，流啊流，经过了一堆中间件。它们有的从 HTTP Header 中解析出了 Cookie，并记录到 Stream 身上；有的将缩成一坨的 POST body 解析成哈希表；有的仅仅是将这个请求的信息打印在终端上。。。但是，它们却都掌握着这条 Stream 的生死大权，随时可以截断它的流动，然后对着地球上的那个人类，丢出一条错误，留下一个未解之谜。

终于，经过了漫长的旅程，这条 Stream 终于到达了它的目的地——某个称之为程序猿的物种留下的业务逻辑。。。嗯然后就各种啪啪啪啪啪啪。。。结果同样以 Stream 的方式返回，再次穿过那茫茫互联网。然后，屏幕前的那个地球人，终于看到浏览器白底黑字恭谨地写着几个大字：

> Hello World!
