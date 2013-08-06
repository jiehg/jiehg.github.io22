---
layout: post
category: 开发
tags: [Node.js, Express.js, Connect]
title: 又是一些 Express.js Middleware
---

实习一个多月，天天对着 Node.js，总该思考点什么了。

[Express.js](expressjs.com) 框架的 Middleware 机制设计得很巧妙。实际上，HTTP 请求是交给下一层的 Connect 处理的，Express.js 在其上丰富了 API。Express.js 的 Middleware 实际上是一套统一接口的处理函数，HTTP 请求被 Node.js 的 HTTP Server 模块接收，由 Connect 负责诸如 POST Body、Querystring、Cookie 之类的解析，然后经由 Express.js 逐个 Middleware 处理，一个 Middleware 处理完就丢给下一个 Middleware，直到到达开发者的业务代码（当然也有的还没到这里已经被返回了，比如静态文件）。

备个忘，近期想抽时间把玩一下的 Express.js (Connect) [Middleware](https://github.com/senchalabs/connect/wiki)：

- [connect-assets](https://github.com/adunkman/connect-assets)
  
  静态文件管理，类似 Ruby on Rails 里的 pipeline。

  通过在模板文件里声明需要用到的静态文件（比如 jQuery 等），自动生成相应的 script 和 link 标签。
  
  开发环境下会为每个文件都生成一个标签；生产环境下会把所有文件整合，并配合 MD5 文件名和过期时间来控制缓存。
  
- [connect-flash](https://github.com/jaredhanson/connect-flash)

  一个很简单的使用场景的封装：保存一条消息（内部通过 Session 实现），在下一个页面取出。取出过的消息自动销毁。
  
  至于如何把消息显示出来，则是由你自己来负责了。这个 Middleware 实际上只是负责一次性消息的存放和取出管理。

- [connect-ensure-login](https://github.com/jaredhanson/connect-ensure-login)

  配合 [Passport.js](http://passportjs.org) 框架来判断用户是否登录，未登录则转跳到指定页面。
  
  同样也是一个经常用到的片段的封装。

----------

好吧，照着Connect 在 GitHub 上的 Wiki 页翻了这么几个 Middleware。[TJ 大神](https://github.com/visionmedia)是一位神一般的大神（这句话。。。），他开源的项目：Connect、Express、Mongoose、Mocha、Should。没错，从 WEB、数据库、单元测试一条龙服务 OTL。
