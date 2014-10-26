---
layout: post
category: 开发
tags: [Android, RecyclerView]
title: 初探 RecyclerView Adapter
---

最近 Android 5.0 SDK (API 21) 发布了，正好 [CNode 开放了 API](https://cnodejs.org/api)，写了个应用练练手。

完整的项目在这里：https://github.com/xingrz/cnode-android

## 引入

`RecyclerView` 是 Android Support v7 提供的控件，需要引入依赖。在 `build.gradle` 的 `dependencies` 里加入：

```groovy
compile 'com.android.support:recyclerview-v7:21.0.+'
```

## 使用

XML layout 和别的控件没多大差别。Java 部分的初始化多了一个叫 Layout Manager 的玩意，同时有个 `LinearLayoutManager` 能够提供类似于 ListView 的布局。

```java
TopicRepliesAdapter repliesAdapter = new TopicRepliesAdapter(this);

RecyclerView repliesView = (RecyclerView) findViewById(R.id.replies);
repliesView.setLayoutManager(new LinearLayoutManager(this));
repliesView.setAdapter(repliesAdapter);
```

`TopicRepliesAdapter` 继承自 `RecyclerView.Adapter`，是本文的重点内容。

## RecyclerView Adapter

看代码吧。

```java
public class TopicRepliesAdapter extends RecyclerView.Adapter<TopicRepliesAdapter.ViewHolder> {

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public ImageView avatar;
        public TextView user;
        public TextView title;
        public HtmlView content;

        public ViewHolder(View itemView) {
            super(itemView);
            this.avatar = (ImageView) itemView.findViewById(R.id.avatar);
            this.user = (TextView) itemView.findViewById(R.id.user);
            this.title = (TextView) itemView.findViewById(R.id.title);
            this.content = (HtmlView) itemView.findViewById(R.id.content);
        }
    }

    public static final int VIEW_TYPE_HEADER = 0;
    public static final int VIEW_TYPE_REPLY = 1;

    private final LayoutInflater inflater;

    private Topic topic;

    public TopicRepliesAdapter(Context context) {
        this.inflater = LayoutInflater.from(context);
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
        notifyDataSetChanged();
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        switch (viewType) {
            case VIEW_TYPE_HEADER:
                return new ViewHolder(inflater.inflate(R.layout.topic_header, parent, false));
            case VIEW_TYPE_REPLY:
                return new ViewHolder(inflater.inflate(R.layout.reply_item, parent, false));
            default:
                return null;
        }
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        switch (getItemViewType(position)) {
            case VIEW_TYPE_HEADER:
                holder.user.setText(topic.author.loginname);
                holder.title.setText(topic.title);
                TextRenderer.render(holder.content, topic.content);
                break;
            case VIEW_TYPE_REPLY:
                Reply item = topic.replies.get(position - 1);
                holder.user.setText(item.author.loginname);
                TextRenderer.render(holder.content, item.content);
                ImageLoader.load(holder.avatar, item.author.avatarUrl);
                break;
        }
    }

    @Override
    public void onViewRecycled(ViewHolder holder) {
        switch (holder.getItemViewType()) {
            case VIEW_TYPE_REPLY:
                holder.avatar.setImageBitmap(null);
                break;
        }
    }

    @Override
    public int getItemCount() {
        return topic == null ? 0 : 1 + topic.replies.size();
    }

    @Override
    public int getItemViewType(int position) {
        return position == 0 ? VIEW_TYPE_HEADER : VIEW_TYPE_REPLY;
    }

}
```

相对于 ListView 几点值得留意的：

* 它的 Adapter 是面向 ViewHolder 的。至于 ViewHolder 是什么，以后再详说吧，总之比以前科学多了。
* 没有 `addHeaderView` 和 `addFooterView` 了，取而代之是更灵活的（其实 ListView 也有的）`getItemViewType`
* 没有 `setOnItemClickListener` 了，自己实现，其实也不难。

```java
public class TopicListAdapter extends RecyclerView.Adapter<TopicListAdapter.ViewHolder> {

    /* ... */

    public static interface OnItemClickListener {
        public void onItemClick(Topic item);
    }

    private final LayoutInflater inflater;

    public TopicListAdapter(Context context, OnItemClickListener listener) {
        /* ... */
        this.listener = listener;
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        final Topic item = topics.get(position);
        /* ... */
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                listener.onItemClick(item);
            }
        });
    }

}
```
