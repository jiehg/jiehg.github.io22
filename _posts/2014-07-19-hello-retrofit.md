---
layout: post
category: 开发
tags: [Android, Retrofit]
title: Retrofit 备忘
---

本来很抗拒 [Retrofit](http://square.github.io/retrofit/) 的，结果前几天在车上无聊想了一下，诶这玩意其实挺美的啊！

## 引入

> 在 21 世纪 10 年代还需要自己拷贝 jar 包的库都是耍流氓。—— 我说的

```gradle
dependencies {
    compile 'com.squareup.retrofit:retrofit:1.6.1'
}
```

Gradle 是什么自己恶补去。

## 声明 API

我喜欢对照着 Resource 来声明 API。

```java
public interface Greet {

    @FormUrlEncoded
    @POST("/greets")
    void create(@Field("message") String message, Callback<Void> callback);

}
```

## 构建类

```java
public class YeahApi {

    private static final String ENDPOINT = "https://api.yeah.xingrz.us";

    // 让 Gson 自动将 API 中的下划线全小写式变量名转换成 Java 的小写开头驼峰式
    private static final Gson gson = new GsonBuilder()
            .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
            .create();

    private static final RestAdapter adapter = new RestAdapter.Builder()
            .setEndpoint(ENDPOINT)
            .setConverter(new GsonConverter(gson))
            .setRequestInterceptor(new RequestInterceptor() {
                @Override
                public void intercept(RequestFacade request) {
                    request.addHeader("User-Agent", "Yeah/" + BuildConfig.VERSION_NAME);
                    request.addHeader("Accept", "application/json");
                }
            })
            .build();

    private static final Greet GREET_API = adapter.create(Greet.class);

    public static Greet greet() {
        return GREET_API;
    }

}
```

## 请求

```java
YeahApi.greet().create("Hello world!", new Callback<Void>() {
    @Override
    public void success(Void aVoid, Response response) {
        // ...
    }

    @Override
    public void failure(RetrofitError error) {
        // ...
    }
});
```

> 原载于 [Segmentfault](http://segmentfault.com/blog/xingrz/1190000000611448)，自己搬运。
