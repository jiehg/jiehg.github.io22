---
layout: post
category: 开发
tags: [Android, CyanogenMod, Vagrant]
title: "Mac OS X 下使用 Vagrant 搭建 AOSP 编译环境"
---

最近在做某设备的 CM 移植工作，写个博客备忘一下。

首先几个基本概念：

- **[AOSP](https://source.android.com)** - Android Open Source Project，原版 Android 源代码，当然仅包含开源的部分（不包括 Nexus 等机型上的 Google 服务）
- **[CyanogenMod](http://wiki.cyanogenmod.com)** - 基于 AOSP 的一个第三方修改版 Android，对 AOSP 进行了许多改进，更易于移植
- **[CWM Recovery](https://github.com/cyanogenmod/android_bootable_recovery)** - ClockworkMod，一个第三方 Recovery，相对于官方 Recovery 增加了一些高级功能，目前由 CyanogenMod 维护

## 环境搭建

AOSP 的编译有几点要求：

- 区分大小写的文件系统
- 至少 40GB 的空间
- 64 位 Linux 系统

## 准备文件系统

上面说了 AOSP 需要区分大小写的文件系统。怎么办？格盘？你用的是 Mac OS X 嘛！

打开**应用程序 / 实用工具 / 磁盘工具**，点**新建映像**，照着填好了：

![新建映像](/attachs/aosp-partition-image.png)

- 名称 **android**
- 大小 **40 GB**
- 格式 **Mac OS 扩展（区分大小写，日志式）**

存到哪个地方，点**创建**。这样你的镜像就建好了，以后 AOSP 的工作都在里面做就好了。用的时候双击 dmg 文件就可以挂载，用完之后直接推出。爽不？

这么做还有一个好处，你要把整份源码带走的话直接拷 dmg 就是了。

镜像挂载路径位于 `/Volumes/android`。

## 下载源代码

AOSP 由很多很多很多 Git 仓库按照特定目录结构组成，如果自己逐个 Git 的话肯定会死人的。官方提供了一个 `repo` 工具可以自动完成这个工作。在 OS X 下可以用 Homebrew 来装：

```sh
brew install repo
```

完了以后就可以拖源代码了。这里我们用 CyanogenMod 的源代码，首先初始化项目：

```sh
cd /Volumes/android
repo init -u git://github.com/CyanogenMod/android.git -b cm-11.0
```

`-b` 后面的参数是分支，可能你看到这篇文章的时候已经不是 CM 11.0 了，可以自己去上面这个 GitHub 项目里看看最新的是什么。

下面开始下载源代码咯：

```sh
repo sync -j 1
```

基于一个大家都懂的原因，所以要顺利拖下全部源代码的话，你懂的。我限制了同时只跑 1 个下载任务，反正「那个了」之后网速就那样。

源代码有很多。。很多。。很多，所以你可以先去睡吧，明天再继续看。

## 用 Vagrant 搭建 Linux 环境

明明官方[也有说](https://source.android.com/source/initializing.html#setting-up-a-mac-os-x-build-environment)可以在 Mac OS X 上编译，为什么我这里写 Linux 呢？

总之我告诉你在我这里 Mac OS X 编译过不了就是了。一个可能是两者对路径的处理方式不同导致 `source build/envsetup.sh` 的时候会报错；另外一个可能是 Xcode 6 的原因，懒得深究。反正有 Vagrant 这个神器。

[Vagrant](http://www.vagrantbox.es/) 是一套用于管理虚拟机镜像的工具。它提供了主流 Linux 发行版的打包好的镜像，借此可以自己配置标准的开发环境。Vagrant 本身不是虚拟机，需要依赖 [VirtualBox](https://www.virtualbox.org/) 运行。

装好 Vagrant，装好 VituralBox，动手吧。在 `/Volumes/android` 目录下敲命令：

```sh
vagrant box add ubuntu/trusty64
vagrant init
```

稍等一段时间（可能需要「内个」）下载 Linux 镜像，完了之后它就是一个标准的 Ubuntu 14.04 了。

且慢！我们是用来跑编译的，所以性能很重要！打开 VirtualBox，你会看到里面有这台虚拟机。把 CPU 和内存都调上去吧！

好了，调好性能参数。开机：

```sh
vagrant up
vagrant ssh
```

这时你就进入到了这台虚拟机的 Shell。此时你就按照[官方的指引](http://source.android.com/source/initializing.html#setting-up-a-linux-build-environment)装一些 APT 包就好了。大致上就是 OpenJDK 7 这些。另外别忘了因为是 64 位的系统，但 Android 里有些工具还是 32 位的，所以也要装相关的组件。因为我也记不清了，遇到错误自己谷歌一下就好了。



干完以后，敲 `exit` 可以退回到宿主机的 Shell。然后 `vagrant halt` 关掉虚拟机，然后你就可以把磁盘镜像推出掉了。

## 设置 ccache

ccache 可以将一些编译结果缓存起来，如果需要经常编译的话可以加快速度（但是第一次编译的速度会很慢）。

因为我是把 `android.dmg` 丢到机械硬盘阵列里的，而我的 MacBook 是 SSD 的，所以当然要把 ccache 弄到 SSD 里对不！好在 Vagrant 可以除了工作目录外再映射一个目录到虚拟机里。

首先，在你喜欢的地方建立一个存放 ccache 缓存的目录，比如 `~/ccache`。然后打开 `/Volumes/android/Vagrantfile`，它实际上是一个 Ruby 文件。找到 Synced Folder 的配置项：

```ruby
# Share an additional folder to the guest VM. The first argument is
# the path on the host to the actual folder. The second argument is
# the path on the guest to mount the folder. And the optional third
# argument is a set of non-required options.
config.vm.synced_folder "~/ccache", "/ccache"
```

重启虚拟机使配置生效，然后我们还要在虚拟机里做些配置。

修改虚拟机里面的 `~/.profile` 文件，在末尾加入：

```sh
export USE_CCACHE=1
export CCACHE_DIR=/ccache

cd /vagrant
source build/envsetup.sh
```

这样每次你 `vagrant ssh` 进入虚拟机的时候就能够帮你把 ccache 启用、切换到工作目录，并且把 AOSP 的编译环境加载进来了。

且慢，ccache 还没初始化对不？`exit` 退出，然后 `vagrant ssh` 重新进入。敲命令：

```sh
prebuilts/misc/linux-x86/ccache/ccache -M 50G
```

这就将 ccache 的大小设置在 50G，看你自己喜好。

好吧，就这些了。

## 参考 / 拓展阅读

- [Android - Downloading and Building](http://source.android.com/source/building.html)
- [Koush - Porting Clockwork Recovery to New Devices](http://www.koushikdutta.com/2010/10/porting-clockwork-recovery-to-new.html)
- [How To Port CyanogenMod Android To Your Own Device](http://wiki.cyanogenmod.org/w/Doc:_porting_intro)
