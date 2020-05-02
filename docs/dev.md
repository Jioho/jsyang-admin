# 快速上手

## 下载项目
```shell
git clone https://github.com/jsyang666/jsyang-admin.git
```

## 安装依赖
> 这里的依赖需要安装两次，是因为一开始前台项目并没有和后台项目放在同一个文件夹中的，后来我将前台拷贝到后台中，考虑到有用户可能不想将两个项目放在同一个文件夹所以并没有将两个package.json进行合并😅
- 安装后台依赖
```shell
cd jsyang-admin

npm install --registry=https://registry.npm.taobao.org
##or
cnpm install
##or
yarn
```
- 安装前台依赖
```shell
cd jsyang-admin/admin

npm install --registry=https://registry.npm.taobao.org
## or
cnpm install
## or
yarn
```

## 修改数据库配置

- 修改后台数据模型链接数据库
>这里假设你的项目准备创建的数据库名为jsyang_admin,用户名为root，密码为jsyang_admin
```js
// jsyang-admin/config/config.default.js
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'jsyang_admin',
    user: 'root',
    password: 'jsyang_admin'
  };
```
> 上线的时候需要修改 jsyang-admin/config/config.prod.js下的数据库配置

- 修改squelize migrate连接数据库配置
```json
// jsyang-admin/database/config.json
{
    "development": {
        "username": "root",
        "password": "jsyang_admin",
        "database": "jsyang_admin",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "test": {
        "username": "root",
        "password": "jsyang_admin",
        "database": "jsyang_admin",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "root",
        "password": "jsyang_admin",
        "database": "jsyang_admin",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}
```
### 创建目标数据库
```shell
mysql -uroot -p                                                    
Enter password:

mysql> CREATE DATABASE `jsyang_admin` CHARACTER SET utf8 COLLATE utf8_general_ci;
Query OK, 1 row affected (0.01 sec)

```
这时可以去数据库中通过查看到创建的目标数据``jsyang_admin``
```shell
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| jsyang_admin       |
+--------------------+
```
### 通过squelize的migration功能体验创建表的快感
```shell
path-to-jsyang-admin> npx sequelize db:migrate

Sequelize CLI [Node: 10.16.0, CLI: 5.5.1, ORM: 4.44.4]

Loaded configuration file "database/config.json".
Using environment "development".
sequelize deprecated String based operators are now deprecated. Please use Symbol based operators for better security, read more at http://docs.sequelizejs.com/manual/tutorial/querying.html#operators node_modules/.4.44.4@sequelize/lib/sequelize.js:245:13
== admins: migrating =======
== admins: migrated (0.098s)
```

这个命令会读取jsyang-admin/databse/migration中的数据库种子文件进行数据表的创建，当前我们只有admins.js一个文件。操作成功可以在数据库中查看到新建的admins表,这个表将作为存储管理员账号密码的表

```shell
mysql> use jsyang_admin
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+------------------------+
| Tables_in_jsyang_admin |
+------------------------+
| SequelizeMeta          |
| admins                 |
+------------------------+
2 rows in set (0.00 sec)
```
到这里我们就已经将所有东西准备就绪，接下来就是启动服务了！

### 启动后台服务
在jsyang-admin的根目录下执行下面的命令
```shell
npm run dev
```
看到``egg started on http://127.0.0.1:7001``代表后台服务启动成功，跑在7001的端口上

### 启动前台项目
重新启动一个窗口，cd 到 jsyang-admin/admin，执行：
```shell
npm start
```
看到
```
App running at:
  - Local:   http://localhost:8000/ (copied to clipboard)
  - Network: http://192.168.199.194:8000/
  ```
  代表前台已经启动成功
  浏览器会自动打开页面如下（点击可以放大哦，装了插件，方便大家查看）：
  
  <a data-fancybox title="前台启动成功界面" href="/showtime.png">![前台启动成功界面](/showtime.png)</a>

  好了，项目已经完全跑起来了，接下来看看这个项目到底是如何神奇地快速生成界面的吧(～￣▽￣)～