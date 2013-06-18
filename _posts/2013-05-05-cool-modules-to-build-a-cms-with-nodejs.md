---
layout: post
category: 开发
tags: [Node.js, Web]
title: 用 Node.js 做内容管理系统，一个不错的组合
---

整理一下备忘

## Web 框架

* [Express](https://github.com/visionmedia/express)

## 模板引擎

* [Consolidate.js](https://github.com/visionmedia/consolidate.js) - 准确来说它不是一个模板引擎，它的作用是把一些著名的模板引擎适配成 Express 兼容的接口
* [Handlebars.js](https://github.com/wycats/handlebars.js) - 扩展了 Mustache 语法的模板引擎

## 数据库操作

* [Mongoose](https://github.com/LearnBoost/mongoose) - MongoDb 官方推荐的 ODM 模型引擎

## Session 持久化

* [connect-mongo](https://github.com/kcbanner/connect-mongo) - 使用 MongoDb 为 Express/Connect 提供 Session 持久化储存

## 用户验证

* [Passport](https://github.com/jaredhanson/passport) - 提供各种用户验证功能，包括接入/提供第三方登录等
* [Passport-Local Mongoose](https://github.com/saintedlama/passport-local-mongoose) - 打通 Passport 和 Mongoose 的插件，使用 PBKDF2 算法给密码加盐

## 其它值得关注的替代方案

* [restify](http://mcavage.github.io/node-restify/) - 如果你的服务只提供纯粹的 API 接入，推荐用这个来替代 Express，针对 API 服务提供了很多便利
* [Hogan.js](https://github.com/twitter/hogan.js) - Twitter 出品的 Mustache 模板引擎
* [mongoskin](https://github.com/kissjs/node-mongoskin) - 类 MongoDb CLI 方式操作 MongoDb 的库，阿里出品！

## 一些同样重要的东西

* [Underscore.js](http://underscorejs.org/) - 一些很常用的 JavaScript 操作的封装
* [Async.js](https://github.com/caolan/async) - 功能很全面的异步操作流程库
* [cheerio](https://github.com/MatthewMueller/cheerio) - 一个提供 jQuery 风格 API 的速度极快的 HTML 解析引擎
* [urllib](https://github.com/TBEDP/urllib) - 对 Node.js 的模拟 HTTP 请求做了很好的封装，阿里出品！

----------

06/06 补充：我叛逃了。Jade 还是比 Consodilate + Handlebars/Hogan 好用。
