'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const Inflector = require('inflected');
//使用shelljs进行sequelize-cli的migration操作，由于egg在dev环境下生成文件会引起应用重启，这个功能不太稳定，因此暂时注释
// const shell = require('shelljs');
const {
  controller,
  migration,
  model,
  adminListJs,
  adminListLess,
  modelJs,
  serviceJs,
  table,
  tableLess
} = require('../template');
const routerArr = require('../template/routerNames');
const routerFilePath = path.resolve(__dirname, '../template/routerNames.js');
// const adminExtendRouterArr = require('../../admin/config/router.extend');
const adminExtendRouterFilePath = 'admin/config/router.extend.js';
const { firstUpperCase, objStr2Obj } = require('../extend/helper');
class CodeController extends Controller {
  getFilePath(packageName) {
    let PackageName = firstUpperCase(packageName);
    let packageNames = Inflector.pluralize(packageName);
    let modelFilePath = path.resolve(__dirname, `../model/${packageName}.js`);
    let migrationFilePath = path.resolve(__dirname, `../../database/migrations/${packageNames}.js`);
    let controllerFilePath = path.resolve(__dirname, `./${packageNames}.js`);
    let adminListPath = `admin/src/pages/${PackageName}`;
    let adminListJsFilePath = path.resolve(adminListPath, `${packageName}.js`);
    let adminListLessFilePath = path.resolve(adminListPath, `${packageName}.less`);
    let adminListmodelFilePath = path.resolve(adminListPath, `model.js`);
    let adminListServiceFilePath = path.resolve(adminListPath, `service.js`);
    let files = {
      modelFilePath,
      migrationFilePath,
      controllerFilePath,
      adminListJsFilePath,
      adminListLessFilePath,
      adminListmodelFilePath,
      adminListServiceFilePath,
      adminListPath
    };
    return files;
  }
  async produce() {
    let {
      packageName,
      structure,
      menuName,
      comments,
      adminType = 'table',
      icon = 'user',
      path
    } = this.ctx.request.body;
    console.log("TCL: CodeController -> produce -> this.ctx.request.body", this.ctx.request.body)
    console.log("TCL: CodeController -> produce -> structure", structure)
    let originStructureObj = this.ctx.helper.objStr2Obj(structure);
    let structureObj = this.ctx.helper.objStr2Obj(structure);
    let commentsObj = {};
    let relationObj = {};
    let markComment = false;
    for (let keyname in structureObj) {
      let value = structureObj[keyname];
      if (comments) {
        if (!markComment) {
          commentsObj = this.ctx.helper.objStr2Obj(comments);
        }
        markComment = true;
      } else {
        commentsObj[keyname] = value ? value.comment : '未命名';
      }
      let richtextRex = /^richtext\(([0-9]+)\)$/;
      let type = value.type;
      if (keyname !== 'id' && typeof value === 'object') {
        if (type === 'relate') {
          let { relation } = value;
          console.log('​CodeController -> produce -> relation', relation);
          if (Array.isArray(relation)) {
            console.log('进来');
            relationObj[keyname] = relation;
          } else if (typeof relation === 'object') {
            // let relationOriginObj = this.ctx.helper.objStr2Obj(relation);
            // let relationArr = relation.split('.');
            // let result;
            // let modelName = firstUpperCase(relation.package);
            // console.log('​CodeController -> produce -> modelName', modelName);
            // let result = await this.ctx.model[modelName].findAll({ raw: true,include: {model: this.ctx.model[]}});
            // console.log('​CodeController -> produce -> result', result);
            // function getRelation(arr, obj) {
            // 	console.log("​CodeController -> getRelation -> obj", obj)
            // 	console.log("​CodeController -> getRelation -> arr", arr)
            //   let targetArr = [];
            //   arr.forEach(item => {
            //     let childrenArr = item[obj.children.package];
            //     let tempObj = {};
            //     if (obj.children) {
            //       let children = getRelation(childrenArr, obj.children);
            //       tempObj = {
            //         label: item[obj.label],
            //         value: item[obj.id],
            //         children
            //       };
            //     } else {
            //       tempObj = {
            //         label: item[obj.label],
            //         value: item[obj.id]
            //       };
            //     }
            //     targetArr.push(tempObj);
            //   });
            //   return targetArr;
            // }
            // let finalRelation = getRelation(result, relation);
            // console.log("​CodeController -> produce -> finalRelation", finalRelation)
            // relationObj[keyname] = finalRelation;
          }
          structureObj[keyname] = { type: 'INTEGER', comment: value.comment };
        } else if (type === 'img') {
          structureObj[keyname] = { type: 'STRING(250)', comment: value.comment };
        } else if (richtextRex.test(type)) {
          let matchArr = type.match(richtextRex);
          // structureObj[keyname] = {type: `STRING(${matchArr[1]})`, comment:value.comment}
          structureObj[keyname] = { type: `TEXT`, comment: value.comment };
        }
      }
    }
    // let newStructure = structureObj.toSource()
    let newStructure = this.ctx.helper.obj2ObjStr(structureObj);
    let rightTypeStructure = newStructure.replace(/type:"([a-zA-Z0-9\(\)]+)"/g, 'type:$1');

    // return;

    let keyNames = Object.keys(commentsObj);
    if (!path) path = `/manage/${packageName}`;
    let PackageName = firstUpperCase(packageName);
    let files = this.getFilePath(packageName);
    let newRouterObj = {
      name: `${menuName}`,
      icon,
      path,
      component: `./${PackageName}/${packageName}`
    };
    // let newAdminExtendRouterArr = [...adminExtendRouterArr, newRouterObj];
    try {
      //生成后台界面
      //0.创建文件夹
      if (!fs.existsSync(files.adminListPath)) {
        fs.mkdirSync(files.adminListPath);
      }

      switch (adminType) {
        case 'table':
          //1.生成页面js
          fs.writeFileSync(
            files.adminListJsFilePath,
            table(packageName, menuName, commentsObj, relationObj, originStructureObj)
          );
          console.log(`生成${files.adminListJsFilePath}`);
          //2.生成页面less
          fs.writeFileSync(files.adminListLessFilePath, tableLess(packageName));
          console.log(`生成${files.adminListLessFilePath}`);
          break;
        case 'list':
          //1.生成页面js
          fs.writeFileSync(
            files.adminListJsFilePath,
            adminListJs(packageName, menuName, commentsObj)
          );
          console.log(`生成${files.adminListJsFilePath}`);
          //2.生成页面less
          fs.writeFileSync(files.adminListLessFilePath, adminListLess(packageName));
          console.log(`生成${files.adminListLessFilePath}`);
          break;
      }

      //3.生成页面model.js
      fs.writeFileSync(files.adminListmodelFilePath, modelJs(packageName));
      console.log(`生成${files.adminListmodelFilePath}`);
      //4.生成页面service.js
      fs.writeFileSync(files.adminListServiceFilePath, serviceJs(packageName));
      console.log(`生成${files.adminListServiceFilePath}`);
      //5.增加后台路由
      let adminRouterFileStr = fs.readFileSync(adminExtendRouterFilePath, {
        encoding: 'utf8'
      });
      let newAdminRouterFileStr = adminRouterFileStr.replace(
        /export default (\[[\s\S]*\])/,
        (match, p1) => {
          let matchArr = objStr2Obj(p1);
          let sampleFlag = matchArr.find(item => {
            return item.path === newRouterObj.path;
          });
          let addedArr = matchArr;
          if (!sampleFlag) {
            addedArr = [...matchArr, newRouterObj];
          }
          let newAdminExtendRouterArr = JSON.stringify(addedArr);
          return `export default ${newAdminExtendRouterArr}`;
        }
      );
      fs.writeFileSync(adminExtendRouterFilePath, newAdminRouterFileStr);
      console.log(
        `修改${adminExtendRouterFilePath}，新增一个路由： ${JSON.stringify(newRouterObj)}`
      );

      //生成后端文件
      //1.生成sequelize-model文件,用于定义数据Model
      fs.writeFileSync(files.modelFilePath, model(packageName, rightTypeStructure));
      console.log(`生成${files.modelFilePath}`);
      //2.生成migration文件，用于生成数据表
      fs.writeFileSync(files.migrationFilePath, migration(packageName, rightTypeStructure));
      console.log(`生成${files.migrationFilePath}`);
      //3.生成controller文件
      fs.writeFileSync(files.controllerFilePath, controller(packageName, keyNames));
      console.log(`生成${files.controllerFilePath}`);
      //4.新增一条egg路由
      let newRouterArr = routerArr;
      let packageNames = Inflector.pluralize(packageName);
      if (!routerArr.includes(packageNames)) {
        newRouterArr = [...routerArr, packageNames];
      }
      fs.writeFileSync(routerFilePath, `module.exports = ${JSON.stringify(newRouterArr)}`);
      console.log(`修改${routerFilePath}，新增一条egg路由: '/api/${packageNames}'`);

      //进行数据表创建，由于egg在dev环境下生成文件会引起应用重启，这个功能不太稳定，因此暂时注释
      // console.log('执行npx sequelize db:migrate');
      // shell.exec('npx sequelize db:migrate', { async: false });
      // console.log('npx sequelize db:migrate执行完毕');
      this.ctx.body = {
        code: 0,
        msg: '代码生成成功'
      };
    } catch (err) {
      console.log(err);
      try {
        files.forEach(filePath => {
          fs.unlink(filePath, err => {
            if (err) {
              console.log(err);
            } else {
              console.log(`从${filePath}删除文件成功`);
            }
          });
        });
        fs.writeFileSync(routerFilePath, `module.exports = ${JSON.stringify(routerArr)}`);
      } catch (err2) {
        console.log(err2);
      }
    }
  }
  delete(routeName) {
    let packageName = this.ctx.request.body.packageName || routeName;
    let packageNames = Inflector.pluralize(packageName);
    let PackageName = firstUpperCase(packageName);
    let files = this.getFilePath(packageName);
    try {
      //进行数据表删除，由于egg在dev环境下生成文件会引起应用重启，这个功能不太稳定，因此暂时注释
      // let removeTableCmd = `npx sequelize db:migrate:undo ${packageName}`;
      // shell.exec(removeTableCmd, { async: false });
      // console.log(`删除数据表${packageName}成功`);
      Object.values(files).forEach(filePath => {
        fs.unlink(filePath, err => {
          if (err) {
            console.log(err);
          } else {
            console.log(`从${filePath}删除文件成功`);
          }
        });
      });
      if (routerArr.includes(packageNames)) {
        routerArr.splice(routerArr.findIndex(item => item === packageNames), 1);
        fs.writeFileSync(routerFilePath, `module.exports = ${JSON.stringify(routerArr)}`);
      }
      let adminRouterFileStr = fs.readFileSync(adminExtendRouterFilePath, {
        encoding: 'utf8'
      });
      let newAdminRouterFileStr = adminRouterFileStr.replace(
        /export default (\[[\s\S]*\])/,
        (match, p1) => {
          let matchArr = objStr2Obj(p1);
          matchArr.splice(
            matchArr.findIndex(item => item.component === `./${PackageName}/${packageName}`),
            1
          );
          let newAdminExtendRouterArr = JSON.stringify(matchArr);
          return `export default ${newAdminExtendRouterArr}`;
        }
      );
      fs.writeFileSync(adminExtendRouterFilePath, newAdminRouterFileStr);
      console.log(`修改${adminExtendRouterFilePath}，删除一个路由： ${packName}`);
      this.ctx.body = {
        code: 0,
        msg: `删除包${packageName}成功`
      };
      console.log(`删除包${packageName}成功`);
    } catch (err2) {
      console.log(err2);
    }
  }
  deleteAll() {
    try {
      Object.values(files).forEach(filePath => {
        this.delete(filePath);
      });
      this.ctx.body = {
        code: 0,
        msg: `删除包${routerArr.toString()}成功`
      };
    } catch (err2) {
      console.log(err2);
    }
  }
}

module.exports = CodeController;
