# 环境准备

## git
git作为大部分程序员首选的版本控制软件自然不用做多介绍，这里git是作为从github下载本项目的工具
- Windows

[gitforwindows](https://gitforwindows.org/)
- mac
```
brew install git
```
- ubuntu
```
apt-get install git
```
- centos
```
yum install git
```

## nodejs
从未安装过的用户建议去[nodejs官网](https://nodejs.org/zh-cn/)下载安装符合你的操作系统的LTS版本,安装后使用``node -v``查看node版本，``npm -v``查看npm版本，如果可以查看对应版本即证明安装成功

安装过的用户也可以使用[nvm](https://github.com/nvm-sh/nvm)(unix)或者[nvm-windows](https://github.com/coreybutler/nvm-windows)进去nodejs版本切换。作者当前电脑的相关版本为
```
node -v                                                               
v10.16.0

npm -v 
6.9.0
```

## mysql
mysql是本项目使用的数据库，安装教程可以参考[mysql安装教程](https://www.runoob.com/mysql/mysql-install.html)，安装后请记住自己设置的用户名和密码，后续在项目配置中将会用到
