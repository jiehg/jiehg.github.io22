---
layout: post
category: 开发
tags: [ProtoBuf, Android]
title: Google Protocol Buffers + Android micro/nano runtime 的编译
---

最近做的项目涉及到 Protobuf，所以就顺便整理上来分享一下吧。

## Protocol Buffers (aka. protobuf) 是啥？

一套序列化方案。也就是说，把定义好的数据转换为经过精心安排的二进制形式，或者反过来。相较于 XML 或 JSON 更省流量。

不多说，大家可以谷歌一下这方面的资料。

下面进入正题。

## 正题

好吧被进入了。

基于 protobuf 的特点，我们需要使用 protobuf 的编译器 `protoc` 将我们的数据结构定义文件（*.proto）编译生成对应语言的操作类。

protobuf 编译器机制是，一个主命令 `protoc`，下面各个不同的语言（比如 Objective-C）通过插件来扩充。这就省去了为了增加一个语言的支持而重新编译编译器（绕口令）的麻烦。

官方版的 protobuf 自带了 Java、Python 和 C++ 的支持。而 Android 团队为了照顾移动平台的计算能力，还做了 Java micro 和 Java nano 两个精简运行时，尽量减少使用一些不是必须的语言特性。不过，无论什么语言，它们生成的二进制格式都是一样的。

### 编译编译器

首先当然要检出源代码。为了得到 Java micro 和 Java nano 两个版本的运行时，我们干脆直接用 Android 团队维护的分支好了。

鉴于 android.googlesource.com 在国内的访问速度有点内啥，我们就用 GitHub 上的同步镜像吧。

```sh
git clone https://github.com/android/platform_external_protobuf.git android-protobuf
```

这条命令会将代码检出到 `android-protobuf/` 目录下。Android 团队的源代码都是按照整个 Android 的发布版本来打 tag 的，所以现在 tag 最新只到 4.4.2。master 分支上最近修复了 OS X 10.9 下一个编译失败问题，所以大胆用 master 分支的代码吧。

下面开始编译。gcc、libtool、autoconf 这些编译工具要先装好。

```sh
cd android-protobuf
./autogen.sh  # 刷出好多东西，最后 exit 0 表示成功
./configure  # 又刷出很多东西，留意没报错就行了
make  # 编译过程那些 xx is deprecated 的 warning 可以不用管
sudo make install  # 安装
```

编译安装完了，测试一下：

```
$ protoc -h
Usage: protoc [OPTION] PROTO_FILES
Parse PROTO_FILES and generate output based on the options given:
  ...bla bla bla...
  --cpp_out=OUT_DIR           Generate C++ header and source.
  --java_out=OUT_DIR          Generate Java source file.
  --javamicro_out=OUT_DIR     Generate Java source file micro runtime.
  --javanano_out=OUT_DIR      Generate Java source file nano runtime.
  --python_out=OUT_DIR        Generate Python source file.
```

看到 Java micro 和 Java nano 都装好了。

### 编译运行时

Java（包括 micro 和 nano）版的运行时都需要一个文件，这个文件本身是通过 `protoc` 编译生成的。这一步经常会不小心漏掉。

进入 `android-protobuf/` 下的 `java/` 目录：

```sh
cd java
protoc --java_out=src/main/java -I../src ../src/google/protobuf/descriptor.proto
```

## 运行时

上面的 `android-protobuf/java/` 目录就是 protobuf 的运行时。简单来说，就是 `protoc` 生成的那堆 Java 类继承自的那些类。

### 在 Android 项目中使用配置运行时

首先，我讨厌 Eclipse，我讨厌 Android Studio。

动手吧：

1. 掏出你的 IntelliJ IDEA
2. 点开 **File / Project Structure...**

    ![](https://cloud.githubusercontent.com/assets/288288/2560229/b3644106-b7b3-11e3-87da-299fa2286157.png)

3. 选 **Modules**，点 **+** 号，**Import Module**

    ![](https://cloud.githubusercontent.com/assets/288288/2560231/fd845154-b7b3-11e3-9666-5e15a2eb4a80.png)

4. 选择刚刚检出的 `android-protobuf/` 目录下的 `java/` 目录

    ![](https://cloud.githubusercontent.com/assets/288288/2560235/35b1743a-b7b4-11e3-8a7b-095fa0736dfd.png)

5. **Import module from external model**，**Maven**

    ![](https://cloud.githubusercontent.com/assets/288288/2560237/61cf1d38-b7b4-11e3-8e4b-abf5454ec6a0.png)

6. **Next**
7. 三个可选的运行时版本，需要的话就选上吧。

    ![](https://cloud.githubusercontent.com/assets/288288/2560239/8bc33a84-b7b4-11e3-802b-b64bfced3c51.png)

8. **Next**，**Next**，**Finish**
9. 回到 **Project Structure / Modules**，点右边下面的 **+** 号，**Module Dependency...**

    ![](https://cloud.githubusercontent.com/assets/288288/2560244/ce84ab32-b7b4-11e3-8fde-cc21a7019725.png)

10. 选刚刚导入进工作区的 `protobuf-java` 模块，**OK**
11. 搞定咯

> 原载于 [Segmentfault](http://segmentfault.com/blog/xingrz/1190000000450911)，自己搬运。
