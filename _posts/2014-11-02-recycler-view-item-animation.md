---
layout: post
category: 开发
tags: [Android, RecyclerView]
title: RecyclerView 列表项动画
---

<video autoplay loop>
  <source type="video/mp4" src="{{ site.url }}/attachs/recycler-view-item-animation.mp4">
</video>

> 上面是个视频，H.264。

正当我还在为毕业设计和两个课程大作业烦得焦头烂额之际…我又忍不住[写了几行代码](https://github.com/xingrz/cnode-android/commit/915f6b2b177700c73b8fad91cc2f461f26b9f909)。

[`RecyclerView`]({{ site.url }}/tags.html#RecyclerView) 还带来了一个新特性：列表项动画（Item Animation）。同时自带了一个动画器是 [`DefaultItemAnimator`](https://developer.android.com/reference/android/support/v7/widget/DefaultItemAnimator.html)，大致上的效果就是挤开前后的列表项然后淡入（反之亦然）。

```java
topicsView.setItemAnimator(new DefaultItemAnimator());
```

没错，如果你还是用 `notifyDataSetChanged()` 来通告数据集变更的话，你只会看到全部列表项一起淡出再淡入的效果。既然是列表项的动画，那么粒度当然要足够小：具体到某一项的增加、删除、移动、变更。于是 `RecyclerView.Adapter` 增加了下面几个方法：

- `notifyItemInserted(position)` - 有一个新项插入到了 `position` 位置
- `notifyItemRangeInserted(position, count)` - 在 `position` 位置插入了 `count` 个新项目
- `notifyItemRemoved(position)`
- `notifyItemRangeRemoved(position, count)`
- `notifyItemChanged(position)`
- `notifyItemMoved(from, to)`
- ...

然后呢…考虑到 `RecyclerView` 目前就只有一个十分基本的 `RecyclerView.Adapter`，作为一个不折腾不舒服星人 `_(:зゝ∠)_`，于是我自己仿照 `ArrayAdapter` 的做法用 [`List<E>`](https://developer.android.com/reference/java/util/List.html) 接口实现了一个 [`ArrayRecyclerAdapter`](https://github.com/xingrz/cnode-android/blob/master/CNode/src/main/java/org/cnodejs/widget/ArrayRecyclerAdapter.java)，里面将这些方法都封装好了。

```java
/* ... */

@Override
public boolean addAll(Collection<? extends E> collection) {
    if (list.addAll(collection)) {
        notifyItemRangeInserted(list.size() - 1, collection.size());
        return true;
    } else {
        return false;
    }
}

/* ... */
```

嗯，好像没什么好说的。
