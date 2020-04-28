const {firstUpperCase} = require('../extend/helper')
const controller = (packageName,keyNames) => {
  let PackageName = firstUpperCase(packageName)
  let defaultKeyNames = ['id','created_at','updated_at']
  let restKeyNames = keyNames.filter(item => !defaultKeyNames.includes(item))
	console.log("​controller -> restKeyNames", restKeyNames)
  let result = `
  'use strict';

  const Controller = require('egg').Controller;
  function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
  }

  class ${PackageName}Controller extends Controller {
    async index() {
      const ctx = this.ctx;
      const query = {
        limit: toInt(ctx.query.limit),
        offset: toInt(ctx.query.offset),
        order: [['id', 'DESC']]
      };
      let result = await ctx.model.${PackageName}.findAll(query);
      ctx.body = {
        list: result,
        pagination: {}
      };
    }

    async show() {
      const ctx = this.ctx;
      ctx.body = await ctx.model.${PackageName}.findById(toInt(ctx.params.id));
    }

    async create() {
      const ctx = this.ctx;
      const ${PackageName} = await ctx.model.${PackageName}.create(ctx.request.body);
      ctx.status = 201;
      ctx.body = ${PackageName};
    }

    async update() {
      const ctx = this.ctx;
      const id = toInt(ctx.params.id);
      const ${PackageName} = await ctx.model.${PackageName}.findById(id);
      if (!${PackageName}) {
        ctx.status = 404;
        return;
      }

      const { ${restKeyNames} } = ctx.request.body;
      await ${PackageName}.update({ ${restKeyNames} });
      ctx.body = ${PackageName};
    }

    async destroy() {
      const ctx = this.ctx;
      const id = toInt(ctx.params.id);
      const ${PackageName} = await ctx.model.${PackageName}.findById(id);
      if (!${PackageName}) {
        ctx.status = 404;
        return;
      }

      await ${PackageName}.destroy();
      ctx.status = 200;
    }
  }

  module.exports = ${PackageName}Controller;
  `
  return result
}
module.exports = controller
