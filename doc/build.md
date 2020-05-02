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

###  构建后台包
```shell
## cd baseDir

```