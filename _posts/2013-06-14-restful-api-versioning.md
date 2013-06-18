---
layout: post
category: 开发
tags: [Web, RESTful, Nginx]
title: 再谈 RESTful API：版本化的实现
---

[上一篇](/2013/2013-06-14/restful-api.html)只是写了个大概，上课无聊再写写实现之类的事情。

版本化对于 API 的发展是好事。

能够让后端不同版本的 API 在不同进程中运行固然也很理想，但如何在均衡器（比如 nginx）上让不同版本的请求反向代理到不同的后端上呢？这个我也不知道。（突然就知道为什么很多服务都是通过 URL 来区分版本了）

----------

刚刚找到了一段 nginx conf，照着写了一个，不知道行不行

```nginx
map $http_accept $api_version {
  default                       api_v3;
  ~application/vnd\.bestng\.v3  api_v3;
  ~application/vnd\.bestng\.v2  api_v2;
  ~application/vnd\.bestng\.v1  api_v1;
}

upstream api_v3 {
  server 127.0.0.1:8803;
}

upstream api_v2 {
  server 127.0.0.1:8802;
}

upstream api_v1 {
  server 127.0.0.1:8801;
}

location / {
  proxy_pass http://$api_version;
}
```

----------

传送门：[总结一下 RESTful API 的设计](/2013/2013-06-14/restful-api.html)
