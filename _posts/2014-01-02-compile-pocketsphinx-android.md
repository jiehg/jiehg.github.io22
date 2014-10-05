---
layout: post
category: 开发
tags: [语音识别, Android]
title: 编译 pocketsphinx-android
---

踩了一下午坑所以备忘一下，主要整理自[官方 Tutorial](http://cmusphinx.sourceforge.net/wiki/tutorialandroid)。

## 准备

```
$ brew install ant
$ brew install swig
$ brew install android-sdk
$ brew install android-ndk
```

或者你也可以手动安装 Android SDK 和 NDK，我是偷懒所以采用 Homebrew 来装。

装完后记得下载 SDK，比如 Android 4.0.3 (API 15)。

## 下载源码

```
$ mkdir sphinx
$ cd sphinx
$ svn checkout svn://svn.code.sf.net/p/cmusphinx/code/branches/pocketsphinx-android pocketsphinx-android
$ svn checkout svn://svn.code.sf.net/p/cmusphinx/code/trunk/pocketsphinx pocketsphinx
$ svn checkout svn://svn.code.sf.net/p/cmusphinx/code/trunk/sphinxbase sphinxbase
```

## 配置

在 `sphinx/pocketsphinx-android` 下面新建一个 `build.properties`，内容如下：

```
sdk.dir=/usr/local/opt/android-sdk
sdk.vsn=15
ndk.dir=/usr/local/opt/android-ndk
```

`sdk.dir` 和 `ndk.dir` 分别是你的 Android SDK 和 NDK 的目录，如果用 Homebrew 安装的话就是我这个了，也可以用命令得到：

```
$ brew --prefix android-sdk
/usr/local/opt/android-sdk
$ brew --prefix android-ndk
/usr/local/opt/android-ndk
```

`sdk.vsn` 就是对应 SDK Platform 的版本，比如我用的是 `15` 对应 Android 4.0.3 (API 15)。

## 编译

```
$ cd pocketsphinx-android
$ ant jar
Buildfile: pocketsphinx-android/build.xml

swig:

compile:
    [javac] Compiling 37 source files to pocketsphinx-android/build/classes

jni:
     [exec] [armeabi-v7a] Compile thumb  : sphinxbase_wrap <= sphinxbase_wrap.c
     [exec] [armeabi-v7a] StaticLibrary  : libsphinxbase_wrap.a
     [exec] [armeabi-v7a] Compile thumb  : pocketsphinx_wrap <= pocketsphinx_wrap.c
     [exec] [armeabi-v7a] StaticLibrary  : libpocketsphinx_wrap.a
     [exec] [armeabi-v7a] SharedLibrary  : libpocketsphinx_jni.so
     [exec] [armeabi-v7a] Install        : libpocketsphinx_jni.so => lib/armeabi-v7a/libpocketsphinx_jni.so
     [exec] [armeabi] Compile thumb  : sphinxbase_wrap <= sphinxbase_wrap.c
     [exec] [armeabi] StaticLibrary  : libsphinxbase_wrap.a
     [exec] [armeabi] Compile thumb  : pocketsphinx_wrap <= pocketsphinx_wrap.c
     [exec] [armeabi] StaticLibrary  : libpocketsphinx_wrap.a
     [exec] [armeabi] SharedLibrary  : libpocketsphinx_jni.so
     [exec] [armeabi] Install        : libpocketsphinx_jni.so => lib/armeabi/libpocketsphinx_jni.so
     [exec] [x86] Compile        : sphinxbase_wrap <= sphinxbase_wrap.c
     [exec] [x86] StaticLibrary  : libsphinxbase_wrap.a
     [exec] [x86] Compile        : pocketsphinx_wrap <= pocketsphinx_wrap.c
     [exec] [x86] StaticLibrary  : libpocketsphinx_wrap.a
     [exec] [x86] SharedLibrary  : libpocketsphinx_jni.so
     [exec] [x86] Install        : libpocketsphinx_jni.so => lib/x86/libpocketsphinx_jni.so
     [exec] [mips] Compile        : sphinxbase_wrap <= sphinxbase_wrap.c
     [exec] [mips] StaticLibrary  : libsphinxbase_wrap.a
     [exec] [mips] Compile        : pocketsphinx_wrap <= pocketsphinx_wrap.c
     [exec] [mips] StaticLibrary  : libpocketsphinx_wrap.a
     [exec] [mips] SharedLibrary  : libpocketsphinx_jni.so
     [exec] [mips] Install        : libpocketsphinx_jni.so => lib/mips/libpocketsphinx_jni.so

jar:
      [jar] Building jar: pocketsphinx-android/build/pocketsphinx-android-0.8-src.jar
      [jar] Building jar: pocketsphinx-android/build/pocketsphinx-android-0.8-nolib.jar
     [copy] Copying 1 file to pocketsphinx-android/build
      [jar] Updating jar: pocketsphinx-android/build/pocketsphinx-android-0.8.jar

BUILD SUCCESSFUL
Total time: 6 seconds
```

搞定。

## 在工程中引入

官方的[原文](http://cmusphinx.sourceforge.net/wiki/tutorialandroid#using_pocketsphinx-android)是这么说的：

> ### Referencing the library in Android project
>
> Put the obtained jar (the one without ”-nolib” suffix) into “libs” directory of your Android project. It should be automatically referenced either by a building script or by IDE - depending on what you are using. Currently the only officially support IDE-s are [Android Studio](http://developer.android.com/sdk/installing/studio.html) and Eclipse (see below).
>
> Due to a [nasty bug](http://code.google.com/p/android/issues/detail?id=17861) in ADT plugin it is currently impossible to include pocketsphinx-android as a single jar. You will have to use ”-nolib” version of the library and add shared libraries manually. For example, if you are building application for ARM architecture, you will have “libs/pocketsphinx-android-0.8-nolib.jar” and “libs/armeabi/libpocketsphinx_jni.so”.

大致意思是说，理论上你只需要把**不带 `-nolib` 的 `.jar` 文件**丢进你的工程的 `libs` 目录就 okay 了。但由于 ADT 的一个 BUG，你可能需要使用带 `-nolib` 版本的 `.jar` 文件，并且手工拷贝对应平台的 `.so` 文件到 `libs` 目录（比如 `libs/armeabi/libpocketsphinx_jni.so`）。

话说印象中 Android Studio 某个版本反而不能识别 `.so` 文件，反而需要将它内置到 `.jar` 包中。

话说如果你只需要某个特定的平台（比如 Google Glass，额呵呵呵呵呵呵呵呵），反而手动引入 `.so` 文件能节省不少体积，额呵呵呵呵呵呵呵呵呵（PO 主没救了。。。）

> 搬运自[我以前在 Segmentfault 的博客](http://segmentfault.com/blog/xingrz/1190000000375655)。
