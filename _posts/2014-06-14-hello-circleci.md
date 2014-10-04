---
layout: post
category: 开发
tags: [CircleCI, 持续集成]
title: 初涉 GitHub + CircleCI
---

考虑到自己维护 Git 服务器的成本，以及国内的类 GitHub 平台的安全顾虑和对钩子、CI 等功能的支持度。。。最后我们团队还是用了 GitHub 的付费 plan。

## CircleCI

有了 GitHub 这么屌的平台，当然也要上个很屌的 CI 啦。留意到了一个 [CircleCI](https://circleci.com/)，相比 Travis CI 有几个不错的地方：

- 可以 SSH 到测试容器，方便在出问题的时候上去调试找原因（咦，好像想到了什么……啊我什么都没说！方校长手下留情！！）
- 私有项目的 plan 比 Travis CI 便宜啊！

## 于是就这么决定了

如何集成到 GitHub，这个和 Travis CI 是一样的，启用一下就行了。GitHub 对它也有比较好的支持，和 Travis CI 没什么差别。

首先建议看两篇文档：

- [Configuring CircleCI](https://circleci.com/docs/configuration)
- [Test environment](https://circleci.com/docs/environment)

关于 Android 项目的配置，[官方文档](https://circleci.com/docs/android)说得几乎等于没说。好吧，虽然 Gradle 项目丢上去不用配置它也知道怎么跑，但是默认环境还是缺了点东西，自己写下配置吧。

```yaml
machine:
  java:
    version: oraclejdk8
  environment:
    ANDROID_HOME: /usr/local/android-sdk-linux

dependencies:
  override:
    - echo y | android update sdk --no-ui --filter "android-20"
    - echo y | android update sdk --no-ui --filter "build-tools-20.0.0"
    - echo y | android update sdk --no-ui --filter "tools"
    - echo y | android update sdk --no-ui --filter "extra-android-m2repository"
    - echo y | android update sdk --no-ui --filter "extra-android-support"
    - echo y | android update sdk --no-ui --filter "extra-google-m2repositor"

test:
  override:
    - ./gradlew build
  post:
    - cp -R ./app/build/outputs/lint-* $CIRCLE_ARTIFACTS
    - cp -R ./app/build/outputs/proguard $CIRCLE_ARTIFACTS
    - cp -R ./app/build/*.apk $CIRCLE_ARTIFACTS
```

简单说一下。首先 `machine` 节点里，我把 JDK 版本指定了 Oracle JDK 8（默认是 OpenJDK 7）。然后又加了一个 `ANDROID_HOME` 的环境变量指向 Android SDK 的位置（TMD，既然你文档里都说了 Android SDK 在这个路径，竟然不给我配好环境变量）。

`dependencies` 节点，如果它识别到你是 Gradle 项目，默认情况下只是 `gradle dependencies`。于是结果显而易见——至少也要把 Android SDK Build-tools 装上吧 XD

对了，它自带的 Gradle 版本是 1.10，有点旧了。而且习惯上我们应该用自己的 wrapper 来跑的（Travis CI 在这点就做得很好，如果判断到你的项目里有 `./gradlew` 就会用里的 wrapper 来跑，而不是系统的 `gradle` 命令）。

## 屌炸天的重点来了

CircleCI 提供了一个归档功能……就是说，你只要在运行完毕之后把需要收集的文件拷贝到 `$CIRCLE_ARTIFACTS` 这个目录，它就会帮你收集保存下来给你下载……屌炸天了对不？

上面我在 `test` 节点挂了个 `post` 钩子，收集编译好的 APK，同时还收集了 ProGuard 的 Mapping 日志（用于跟踪混淆后的代码），收集 Lint 报告报告。。。嘿嘿

> 原载于 [Segmentfault](http://segmentfault.com/blog/xingrz/1190000000578286)，自己搬运。有更新。
