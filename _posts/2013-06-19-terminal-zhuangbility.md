---
layout: post
category: 开发
tags: [iTerm2, zsh, shell]
title: 折腾了一下 Terminal
---

![装逼的终端](/attachs/iterm2-zsh-agnoster-git.png)

闲来无事折腾一下工作环境。

之前已经听说 iTerm2 是个好东西了，之前也听说过 zsh 是个好东西了。

动手。


## 终端应用：[iTerm2](http://www.iterm2.com)

下载安装，这个你懂的。

按 `Command + ,` 打开偏好设定窗口：

1. Profiles / Window，把 Settings for New Windows 中的 Style 改成 `Left of Screen` 让它在屏幕左侧显示（在宽屏显示器上效果不错）
2. Keys，勾选 Hotkey 中的 `Show/hide iTerm2 with a system-wide hotkey`，然后设定一个热键。我个人偏爱 `Command + .`。

现在按 `Command + .` 就可以随时调出或者隐藏 iTerm2 了。


## 配色方案：[Solarized Dark](http://ethanschoonover.com/solarized)

下载，解压，打开 iTerm2 的偏好设定，Profiles / Colors，最下面的 Load Presets ... / Import... 加载 `iterm2-colors-solarized/Solarized Dark.itermcolors` 配色方案。


## Z-Shell

系统自带了 4.0 版的 zsh，但我们可以用 `brew install` 安装最新的 5.X。

```sh
brew install zsh
chsh -s `brew --prefix zsh`/bin/zsh  # 切换系统当前用户的默认 shell 为 zsh
```

安装完毕，`Command + W` 关闭 iTerm2 当前窗口，然后按 `Command + .` 重新打开，此时 shell 已经换成 zsh 了。

## [oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

这是一套十分强大的 zsh 配置方案。

```sh
curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh
```

下载[这个字体补丁](https://gist.github.com/qrush/1595572/raw/417a3fa36e35ca91d6d23ac961071094c26e5fad/Menlo-Powerline.otf)并安装，给系统中的 Menlo 字体进行增补。

打开 iTerm2 的偏好设定，Profiles / Text，把 Regular Font 和 Non-ASCII Font 都换成 Menlo，大小为 14pt Regular。

编辑 `~/.zshrc` 文件：

```sh
ZSH_THEME="agnoster"          # 使用 agnoster 主题，很好很强大

DEFAULT_USER="你的用户名"     # 增加这一项，可以隐藏掉路径前面那串用户名

plugins=(git brew node npm)   # 自己按需把要用的 plugin 写上
```

其中插件可以看[这里](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)。

另外，建议把末尾的 `export PATH` 稍微调整一下，比如 Homebrew 就建议 `/usr/local/bin` 应该优先于 `/usr/bin`；另外也可以自己加上比如 Ruby Gems 目录 `/usr/local/opt/ruby/bin`、Node.js NPM 目录 `~/bin` 等。

```sh
export PATH=/usr/local/bin:/usr/local/sbin/:$HOME/bin:$PATH
```

关于 Homebrew 的路径，比如 zsh 这个包可以通过 `brew --prefix zsh` 知道它的目录是 `/usr/local/opt/zsh`，关于这些链接：

* `/usr/local/opt/zsh` 目录 -> `/usr/local/Cellar/zsh/版本号` 目录
* `/usr/local/bin/zsh` 文件 -> `/usr/local/Cellar/zsh/版本号/bin/zsh` 文件

所以就有了上面那条 `chsh -s` 命令的写法。

重新打开 iTerm2 窗口，配置完成~
