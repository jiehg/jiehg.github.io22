---
layout: post
category: 开发
tags: [Web, RESTful, OAuth2]
title: 继续谈 RESTful API：关于鉴权
---

关于 API 的鉴权，已经有很多人讲过了，尝试结合自己的理解总结一下。

[OAuth 2.0](http://tools.ietf.org/html/rfc6749) 定义了一个很周全的认证框架（所以后来从「协议」改称「框架」了），值得参考。

分开两种大情景来说吧。

## 有用户参与的

什么叫有用户参与的呢？你提供服务，用户使用服务，第三方应用需要你授权它们获取用户数据，就是这么回事。

OAuth 2.0 定义了三种流程：

* [Authorization Code Grant](http://tools.ietf.org/html/rfc6749#section-4.1)：适用于有服务器（换个时髦点的词吧：云服务）的第三方应用。
* [Implicit Grant](http://tools.ietf.org/html/rfc6749#section-4.2)：适用于没服务器的第三方应用，比如浏览器插件。
* [Resource Owner Password Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.3)：直接让用户输入用户名和密码授权。

前两种的特征是，用户点击了第三方应用的授权按钮之后会转跳到服务提供者的页面，让用户确认授权。第三种则是填完用户名和密码后就直接完成授权过程了。考虑到第三方应用的安全无法保证，所以提供商一般是不会向关系不太熟悉的第三方开放第三种方式的。

具体的流程已经有很多资料了，不详说。

## 没用户参与的

这个好理解，API 的调用者不需要知道当前登录的是谁。

这种情景比较好理解，比如匿名评论，比如访问公共资源，等等。

有三种设计：

* 完全公开：根本不需要在意谁在调用 API 的。
* Basic Auth：将 App Key 和 App Secret 作为 HTTP Basic Auth 中的用户名和密码来请求。
* OAuth 2.0 中的 [Client Credentials Grant](http://tools.ietf.org/html/rfc6749#section-4.4)：类似第二种，不过流程更加规范，首先用 App Key 和 App Secret 来获得 Access Token，然后用 Access Token 来调用其它接口。

后两种，个人觉得需要看情况来选择。如果你的服务就只有两三个接口，显然 OAuth 2.0 增加了一次获取 Access Token 的请求就很多余了。

## 总结

当然了，不是所有 API 一开始就是为开放平台而设计的。如果只是为了诸如自己的手机客户端设计 API 的话当然不必完全实现 OAuth 规范。不过，设计时尽量贴近、避免使用 OAuth 的命名来做与 OAuth 不一样的事情，以后要做开放也能够避免大改。

----------

传送门：[总结一下 RESTful API 的设计](/2013/2013-06-14/restful-api.html)
