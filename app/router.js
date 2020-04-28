'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const { routerFunc } = require('./template/router')
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/code/produce', controller.code.produce)
  router.post('/api/code/delete', controller.code.delete)
  router.post('/api/code/deleteAll', controller.code.deleteAll)
  router.post('/api/adminLogin', controller.admins.adminLogin)
  router.post('/api/changepasswd', controller.admins.changepasswd)
  router.post('/api/source/upload', controller.source.upload);
  router.post('/api/source/wangEditorImg', controller.source.wangEditorImg);
  routerFunc(app)
};