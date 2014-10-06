---
layout: page
title: 链接
group: navigation
---

## 联系我

- **Weibo: [@SINGYUCHAN](http://weibo.com/xingrz)** 没什么好看的
- **GitHub: [@xingrz](https://github.com/xingrz)**
- **E-mail: [chenxingyu92@gmail.com](mailto:chenxingyu92@gmail.com)**

## 友情链接

- **[iMID](http://imid.me/)** - Android 大神碎星的博客
- **[天涯望帆](http://mjason.github.io/)** - 语言狂人、伟大的、邪恶的、认为一切问题都是语言问题的工头 MJ
- **[Randy's Blog](http://djyde.github.io/)** - 同校的 Randy 师弟

## 其它有用的资源

- **[Android Developers](https://developer.android.com/develop)** - Android 开发者官网，官方的各种参考资料
- **[Square](http://square.github.io/)** - 一个很屌的组织，开源了 [Retrofit](/tags.html#Retrofit-ref) / Picasso / Otto 等很屌的 Java / Android 库

## 本站

{% for node in site.pages %}{% if node.title != null and (node.group == null or node.group == 'navigation') %}
  - [{{node.title}}]({{node.url}}){% endif %}{% endfor %}
