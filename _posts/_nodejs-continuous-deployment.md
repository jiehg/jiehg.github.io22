---
layout: post
category: 开发
tags: [翻译, Node.js]
title: 使用 fleet 进行多服务器连续部署
---

_[原帖](http://substack.net/multi-server-continuous-deployment-with-fleet)由 SubStack 发表于 2012 年 4 月 30 日。觉得比较实用，于是翻译转帖。_

_[Original post]http://substack.net/multi-server-continuous-deployment-with-fleet) at 2012/4/30 by SubStack. Translated and reposted as I thinks it's useful._

----------

![fleet](http://substack.net/images/fleet.png)

Writing applications as a sequence of tiny services that all talk to each other over the
network has many upsides, but it can be annoyingly tedious to get all the subsystems up and
running.

将应用开发成一系列通过网络相互通信的小粒度服务有很多优点，但如果要维持这整个系统的运行，有时候是神烦的！

Running a [seaport](http://substack.net/semver_your_services_with_seaport) can help with
getting all the services to talk to each other, but running the processes is another matter,
especially when you have new code to push into production.

使用 [seaport](http://substack.net/semver_your_services_with_seaport) （意思：海港）可以帮助所有服务相互进行通信，但运行这些进程却又是另一回事，尤其是当你有新代码要推送到生产环境时。

[fleet](http://github.com/substack/fleet) aims to make it really easy for anyone on your team
to push new code from git to an armada of servers and manage all the processes in your stack.

[fleet](http://github.com/substack/fleet) （意思：舰队）的作用就是让你的团队可以非常轻松地通过 git 向服务器舰队推送新代码，管理堆栈中的进程。

To start using fleet, just install the fleet command with [npm](http://npmjs.org/):

要开始使用 fleet，仅需通过 [npm](https://npmjs.org/) 安装：

```
$ npm install -g fleet
```

Then on one of your servers, start a fleet hub. From a fresh directory, give it a passphrase
and a port to listen on:

然后在你的其中一台服务器启动一个 fleet 中心。在一个空目录中，指定一个口令和监听端口：

```
$ fleet hub --port=7000 --secret=beepboop
```

Now fleet is listening on :7000 for commands and has started a git server on :7001 over http.
There's no ssh keys or post commit hooks to configure, just run that command and you're ready
to go!

这样 fleet 就会在 :7000 端口监听指令并在 :7001 通过 HTTP 协议启动一个 git 服务器，不需要 SSH 密钥，也不需要配置钩子，就执行那条你懂的命令！

Next set up some worker drones to run your processes. You can have as many workers as you
like on a single server but each worker should be run from a separate directory. Just do:

接下来配置运行你的进程的「战机」（drone）。在一台服务器上你可以有许多「战机」，但他们需要有各自独立的运行目录：

```
$ fleet drone --hub=x.x.x.x:7000 --secret=beepboop
```

where x.x.x.x is the address where the fleet hub is running. Spin up a few of these drones.

其中 `x.x.x.x` 是 fleet 中心运行的地址。启动若干个这样的「战机」。

Now navigate to the directory of the app you want to deploy. First set a remote so you don't
need to type --hub and --secret all the time.

现在，前往你要部署的 app 的目录，设定远端以便不需要每次都指定 `--hub` 和 `--secret` 参数。

```
$ fleet remote add default --hub=x.x.x.x:7000 --secret=beepboop
```

Fleet just created a fleet.json file for you to save your settings.

Fleet 会创建一个 `fleet.json` 文件来保存你的设定。

From the same app directory, to deploy your code just do:

在同一个 app 目录，执行部署命令：

```
$ fleet deploy
```

The deploy command does a git push to the fleet hub's git http server and then the hub instructs
all the drones to pull from it. Your code gets checked out into a new directory on all the fleet
drones every time you deploy.

部署命令会执行一个 git push 到 fleet 中心的 git http 服务器，紧接着中心会命令所有「战机」向它拉取代码。每一次部署您的代码都会被检出到所有战机的一个新目录

Because fleet is designed specifically for managing applications with lots of tiny services, the
deploy command isn't tied to running any processes. Starting processes is up to the programmer
but it's super simple. Just use the fleet spawn command:



```
$ fleet spawn -- node server.js 8080
```

By default fleet picks a drone at random to run the process on. You can specify which drone you
want to run a particular process on with the --drone switch if it matters.

Start a few processes across all your worker drones and then show what is running with the fleet
ps command:

```
$ fleet ps
drone#3dfe17b8
├─┬ pid#1e99f4
│ ├── status:   running
│ ├── commit:   webapp/1b8050fcaf8f1b02b9175fcb422644cb67dc8cc5
│ └── command:  node server.js 8888
└─┬ pid#d7048a
  ├── status:   running
  ├── commit:   webapp/1b8050fcaf8f1b02b9175fcb422644cb67dc8cc5
  └── command:  node server.js 8889
```

Now suppose that you have new code to push out into production. By default, fleet lets you spin
up new services without disturbing your existing services. If you fleet deploy again after
checking in some new changes to git, the next time you fleet spawn a new process, that process
will be spun up in a completely new directory based on the git commit hash. To stop a process,
just use fleet stop.

This approach lets you verify that the new services work before bringing down the old services.
You can even start experimenting with heterogeneous and incremental deployment by hooking into
a custom [http proxy](http://substack.net/bounce_http_requests_with_bouncy)!

Even better, if you use a service registry like [seaport](http://substack.net/semver_your_services_with_seaport)
for managing the host/port tables, you can spin up new ad-hoc staging clusters all the time
without disrupting the normal operation of your site before rolling out new code to users.

Fleet has many more commands that you can learn about with its git-style manpage-based help
system! Just do fleet help to get a list of all the commands you can run.

```
$ fleet help
Usage: fleet <command> [<args>]

The commands are:
  deploy   Push code to drones.
  drone    Connect to a hub as a worker.
  exec     Run commands on drones.
  hub      Create a hub for drones to connect.
  monitor  Show service events system-wide.
  ps       List the running processes on the drones.
  remote   Manage the set of remote hubs.
  spawn    Run services on drones.
  stop     Stop processes running on drones.

For help about a command, try `fleet help <command>`.
```

`npm install -g fleet` and [check out the code on github](https://github.com/substack/fleet)!


