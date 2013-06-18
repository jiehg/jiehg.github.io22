---
layout: post
category: 杂谈
tags: [Jekyll, GFM]
title: Jekyll + GFM
---

妈蛋，[谁](http://calefy.org/2012/03/03/my-process-of-building-jekyll-blog.html)说 GitHub Pages 跑的 Jekyll 不支持 [GFM](https://help.github.com/articles/github-flavored-markdown) 的。。。

绕了弯路了。

编辑 `_config.yml`，加上一句：

```yml
markdown: redcarpet
```

完事儿。
