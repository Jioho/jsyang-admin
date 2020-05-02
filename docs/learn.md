# 使用教程

## 登录后台
默认登录账号:``admin``,密码：``jsyang666``
>这两个写死在代码里了,可以在/jsyang-admin/app/controller/admins.js下的``adminLogin``函数去修改对应代码

## 创建没有生成代码和管理员管理菜单的用户
点击管理员管理-新建-输入账号密码-确定
<a data-fancybox title="点击管理员管理-新建-输入账号密码" href="/new-user.png">![点击管理员管理-新建-输入账号密码](/new-user.png)</a>
<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502123446.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502123446.png)</a>

## 生成最简单的curd(增删改查)界面
假设我们现在要做有个学生统计表，学生有id,学号sid，性别sex,年龄age,电话号码telphone，学分score,创建时间created_at,更新时间updated_at这些字段，现在我们需要给他做一个增删改查的功能，同时还要提供接口给移动端或者其他客户端使用，看看我们怎么通过JsyangAdmin快速实现这个功能:
### 新建一个符合以上需求的对象(建议在ide中用js文件编写，可以事先检查语法错误):
```js
{
  id: { type: 'INTEGER', primaryKey: true, autoIncrement: true, comment: '学生ID' },
  sid: { type: 'STRING(50)', comment: '学号' },
  sex: { type: 'INTEGER',comment: '性别' },
  age: { type: 'INTEGER', comment: '年龄' },
  telphone: { type: 'STRING(20)', comment: '电话号码' },
  score: { type: 'INTEGER', comment: '学分' },
  created_at: { type: 'DATE', comment: '创建时间' },
  updated_at: { type: 'DATE', comment: '更新时间' }
}
```
- 点击代码生成
- 输入菜单名：学生管理（提交后将在左边侧边栏显示)
- 输入报名: student (将会作为生成的代码的包的命名，包括后台接口名等等)
- 字段结构选择代码形式（图形化形式还在开发中⊙﹏⊙||| ）
- 将以上写好的对象复制进Model定义源代码的输入框中
- 点击提交

<a data-fancybox title="代码生成" href="/add-structure.png">![代码生成](/add-structure.png)</a>
如果看到提交成功的提示说明代码已经生成成功，这时候你会看到前台和后台的两个命令行窗口已经开始自动编译，运行了:
<a data-fancybox title="代码生成" href="/student-success.png">![代码生成](/student-success.png)</a>
这个时候先不要急着点击学生管理查看效果，会报错的，因为数据表还没生成呢，所以还需要一步(这里后续会考虑引入shell.js自动执行，再给大家省点心😁)

### 生成数据表
上述生成的代码包含在jsyang-admin/database/migrations/students.js，所以我们可以在**根目录**执行下面的命令生成student表：
```shell
npx sequelize db:migrate

Sequelize CLI [Node: 10.16.0, CLI: 5.5.1, ORM: 4.44.4]

Loaded configuration file "database/config.json".
Using environment "development".
sequelize deprecated String based operators are now deprecated. Please use Symbol based operators for better security, read more at http://docs.sequelizejs.com/manual/tutorial/querying.html#operators node_modules/.4.44.4@sequelize/lib/sequelize.js:245:13
== students: migrating =======
== students: migrated (0.264s)
```

可以看到studen种子文件已经被播种生成了students表了,去mysql看一下:
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
| students               |
+------------------------+
3 rows in set (0.00 sec)
```
确定students表生成成功，现在我们可以放心地去点击前台的**学生管理**菜单查看效果了：

<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502122246.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502122246.png)</a>

### 测试增删改查功能
- 新增 & 查看
<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131306.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131306.png)</a>
<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131411.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131411.png)</a>

- 编辑

<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131549.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131549.png)</a>

<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131717.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502131717.png)</a>

- 删除
<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502132114.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502132114.png)</a>
<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502132156.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502132156.png)</a>
<a data-fancybox title="" href="https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502132244.png">![](https://cdn.jsdelivr.net/gh/jsyang666/imgbed/20200502132244.png)</a>

到这里，我们的学生表的增删改查功能已经测试完毕（在测试过程中发现忘记添加姓名字段了，不过这个没关系，跟其他字符串字段是一个道理的）

这里还有一个问题就是性别那里为啥设置为1和2呢，那填3怎么办。这里其实只是为了给大家演示简单字段的设置，其实性别这种可选范围的字段可以用relate类型。
除了relate类型，项目还支持其他高级类型，如头像字段可以设置img类型，新闻内容可以设置为richtext类型，同时图片、富文本上传功能都给你做好了，是不是很省心。高级类型具体使用可以查看[进阶](/advance)
