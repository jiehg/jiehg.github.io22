在伯乐在线看到了一篇不错的[文章](http://blog.jobbole.com/41233/)，结合之前的实践总结一下。

不断编辑中。

## URL、Action

* **GET /tickets** 获取 ticket 列表
* **GET /tickets/12** 获取具体的 ticket 12
* **POST /tickets** 新建一个 ticket
* **PUT /tickets/12** 更新 ticket 12
* **DELETE /tickets/12** 删除 ticket 12
* **GET /tickets/12/messages** 获取 ticket 12 的 message 列表
* **GET /tickets/12/messages/5** 返回 ticket 12 中的 message 5
* **POST /tickets/12/messages** 在 ticket 12 中新建 message
* **POST /gists/12/star** 加星
* **DELETE /gists/12/star** 取消加星

## 版本化

请求

```http
GET /resource HTTP/1.1
Host: api.myserver.com
Accept: application/vnd.COMPANY.VERSION+json
```

返回

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.COMPANY.VERSION+json
```

对于不支持的版本（比如已被废弃或者不存在），返回 `415 Unsupported Media Type` 并说明原因。

```http
HTTP/1.1 415 Unsupported Media Type
Content-Type: application/json
Cache-Control: no-store

{
  "code" : 1234,
  "message" : "API v1.0 is deprecated."
}
```

## 筛选条件

```http
GET /ticket?state=open HTTP/1.1
Host: api.myserver.com
```

## 分页

使用 [RFC 5988](http://tools.ietf.org/html/rfc5988) 定义的 Link Header 来提供分页信息。

值得一提的是，Link Header 在 Web 中也被用于[预加载](https://developer.mozilla.org/en-US/docs/Link_prefetching_FAQ)。

```http
HTTP/1.1 200 OK
Link: <https://api.github.com/resource?page=2>; rel="next",
      <https://api.github.com/resource?page=5>; rel="last"
```

其中 [rel](http://blog.whatwg.org/the-road-to-html-5-link-relations#rel-first) 可取值：

* **first** - 第一页
* **prev** - 上一页
* **next** - 下一页
* **last** - 最后一页
* **up** - 上一层

## 频率限制

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
```

对于超过频率的请求返回 [RFC 6585](http://tools.ietf.org/html/rfc6585) 中增加的 `HTTP/1.1 429 Too Many Requests`。

## 鉴权

原则上使用 Bearer 进行鉴权。

```http
GET /resource HTTP/1.1
Host: api.myserver.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

关于 Bearer Token 的授予方式，开放 API 使用 OAuth 2.0 认证框架，自用的 API 为了轻量可使用 Access Key 和 Secret Key 通过的 Basic 认证换取 Bearer Token。

```http
POST /token HTTP/1.1
Host: api.myserver.com
Accept: application/vnd.bestng.v1+json
Authorization: Basic ACCESSKEY:SECRETKEY
```

返回

```http
HTTP/1.1 201 Created
Content-Type: application/vnd.bestng.v1+json
Cache-Control: no-store

{
  "access_token": "SItfD0m6oJ4AAQEAAABMOVP_D4VbBwAASItXF0jB",
  "token_type": "Bearer"
}
```

## 时间格式

[RFC 1123](http://tools.ietf.org/html/rfc1123) 中定义了 HTTP 协议中使用的时间格式：

```
Fri, 14 Jun 2013 02:59:55 GMT
```

之所以不推荐使用 UNIX Timestamp 或者 JavaScript 时间的原因是，文本时间在保持可读的情况下亦可以方便地被解析：

```javascript
var time = new Date("Fri, 14 Jun 2013 02:59:55 GMT")
alert(time)    // Fri Jun 14 2013 10:59:55 GMT+0800 (CST)
```

## 缓存

ETag、Last-Modified

## 错误信息

```json
{
  "code" : 1234,
  "message" : "Something bad happened <img src="http://blog.jobbole.com/wp-includes/images/smilies/icon_sad.gif" alt=":-(" class="wp-smiley"> ",
  "description" : "More details about the error here"
}
```

## HTTP Status Code

* **200 OK**  - 请求成功
* **201 Created**  - 创建成功，多用于 POST
* **304 Not Modified** - 缓存有效
* **400 Bad Request** - 请求格式错误
* **401 Unauthorized** - 未授权
* **403 Forbidden** - 授权有效，但无权访问
* **404 Not Found** - 资源不存在
* **409 Conflict** - 冲突
* **415 Unsupported Media Type** - 不支持的媒体类型，比如错误的版本号
* **429 Too Many Requests** - 请求过多


## 对 JSONP 的 fallback

当请求中包含了 `?callback=` 参数时，假定为 JSONP 请求。

此时 URL 中可包含的参数：

* `v` 版本号
* `access_token`

请求

```http
GET /resource?callback=jsonp_callback&v=1&access_token=YOUR_ACCESS_TOKEN HTTP/1.1
Host: api.myserver.com
```

总是返回 `HTTP/1.1 200 OK`

```http
HTTP/1.1 200 OK
Content-Type: text/javascript

jsonp_callback({
  status_code: 200,    // 真实的 Status Code
  next_page: "http://...",
  response: {
    // 真实的返回数据
  }
})
```

## 参考

* [RESTful API 设计最佳实践](http://blog.jobbole.com/41233/)
* [GitHub API v3](http://developer.github.com/v3/)

## 讨论

欢迎继续探讨。
