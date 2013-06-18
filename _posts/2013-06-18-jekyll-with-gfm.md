---
layout: post
category: 杂谈
tags: [Jekyll, GFM]
title: Jekyll + GFM
---

妈蛋，[谁](http://calefy.org/2012/03/03/my-process-of-building-jekyll-blog.html)说 GitHub Pages 跑的 Jekyll 不支持 [GFM](https://help.github.com/articles/github-flavored-markdown) 的。。。

绕了弯路了。

编辑 `_config.yml`，加上一句：

```yaml
markdown: redcarpet
```

完事儿。

----------

把之前的文章都搬过来了，CSS 样式还要继续优化一下。先测试一段时间，然后再把这个主题开源。
