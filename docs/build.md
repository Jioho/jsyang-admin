# 构建与部署

## 后台服务的部署
[egg部署文档](https://eggjs.org/zh-cn/core/deployment.html)

## 前台的部署
[antd-design-pro构建和部署](https://pro.ant.design/docs/build-cn)

## 构建部署示例
### 导出项目sql
在jsyang-admin根目录执行如下命令
```shell
mysqldump --column-statistics=0 -u root -p jsyang_admin > jsyang_admin.sql
```
就会在目录下生成``jsyang_admin.sql``文件
### 将导出的sql文件传入服务器中
```shell
scp -r jsyang_admin.sql  [user]@[ip]:[target_path]
```

### 登录到服务器中，登录mysql，创建数据库，导入数据
```shell
mysql> CREATE DATABASE `jsyang_admin` CHARACTER SET utf8 COLLATE utf8_general_ci;
Query OK, 1 row affected (0.03 sec)

mysql> use jsyang_admin;
Database changed
mysql> source /tmp/jsyang_admin.sql;
## /tmp/jsyang_admin.sql is the target path you send your sql
mysql> show tables;
+------------------------+
| Tables_in_jsyang_admin |
+------------------------+
| admins                 |
| goods                  |
| sequelizemeta          |
| students               |
+------------------------+
4 rows in set (0.00 sec)
```

###  将项目拉到服务器中
```shell
[root@VM_0_7_centos project]# git clone https://github.com/jsyang666/jsyang-admin.git
```
### 安装后台服务生产依赖
```shell
[root@VM_0_7_centos project] cd jsyang-admin/
[root@VM_0_7_centos jsyang-admin] npm i --production
```
### 如果服务器的mysql密码和代码中的生产配置不同，记得修改一下
```shell
[root@VM_0_7_centos jsyang-admin] vim config/config.prod.js
```
### 启动后台服务
```shell
[root@VM_0_7_centos jsyang-admin] npm start

> server@1.0.0 start /project/jsyang-admin
> egg-scripts start --daemon --title=egg-server-server

[egg-scripts] Starting egg application at /project/jsyang-admin
[egg-scripts] Run node /project/jsyang-admin/node_modules/egg-scripts/lib/start-cluster {"title":"egg-server-server","baseDir":"/project/jsyang-admin","framework":"/project/jsyang-admin/node_modules/egg"} --title=egg-server-server
[egg-scripts] Save log file to /root/logs
[egg-scripts] Wait Start: 1...
[egg-scripts] Wait Start: 2...
[egg-scripts] egg started on http://127.0.0.1:7001
```
看到``egg started on http://127.0.0.1:7001``说明后台服务已经启动成功
### 构建前台项目
```shell
[root@VM_0_7_centos jsyang-admin] vim config/config.prod.js
```
### 将构建完的前台包发送到服务器中的nginx目录
```shell
scp -r dist/*  [user]@[ip]:[nginx_page_path_of_jsyang_admin_front]
```
### 配置nginx端口转发，将前台的```/server/api/xxx```请求转发到```localhost:7001/api/xxx```
在nginx配置增加一个server
```shell
server {
                listen       80;
                ## the site of you site
                server_name  jsyang-admin.huangyanyang.cn;
                ## the path you save jsyang-admin front end build code
                root /var/www/jsyang-admin;
                location / {
                        try_files $uri $uri/ =404;
                }
                location ^~ /server {
                        proxy_pass              http://127.0.0.1:7001;
                        rewrite ^/server/api/(.*)$ /api/$1 break;
                        proxy_set_header        Host 127.0.0.1;
                        proxy_set_header        X-Real-IP $remote_addr;
                        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
                }
        }
```
配置完nginx记得重启nginx才能生效
```shell
systemctl restart nginx
```
这样配置就已经完成了，当然，要想通过上面配置的 jsyang-admin.huangyanyang.cn访问JsyangAdmin，还得进行域名解析:
<a data-fancybox title="" href="https://gitee.com/hyy930256283/imgbed/raw/master/blog/20200502222520.png">![](https://gitee.com/hyy930256283/imgbed/raw/master/blog/20200502222520.png)</a>

这样，就大功告成了！使用浏览器访问[http://jsyang-admin.huangyanyang.cn](http://jsyang-admin.huangyanyang.cn)试试吧
>默认账号仍然为admin，密码为jsyang666
