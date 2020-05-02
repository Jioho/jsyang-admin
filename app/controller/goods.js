
  'use strict';

  const Controller = require('egg').Controller;
  function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
  }

  class GoodController extends Controller {
    async index() {
      const ctx = this.ctx;
      const query = {
        limit: toInt(ctx.query.limit),
        offset: toInt(ctx.query.offset),
        order: [['id', 'DESC']]
      };
      let result = await ctx.model.Good.findAll(query);
      ctx.body = {
        list: result,
        pagination: {}
      };
    }

    async show() {
      const ctx = this.ctx;
      ctx.body = await ctx.model.Good.findById(toInt(ctx.params.id));
    }

    async create() {
      const ctx = this.ctx;
      const Good = await ctx.model.Good.create(ctx.request.body);
      ctx.status = 201;
      ctx.body = Good;
    }

    async update() {
      const ctx = this.ctx;
      const id = toInt(ctx.params.id);
      const Good = await ctx.model.Good.findById(id);
      if (!Good) {
        ctx.status = 404;
        return;
      }

      const { title,category,img,detail,storeNumber,status } = ctx.request.body;
      await Good.update({ title,category,img,detail,storeNumber,status });
      ctx.body = Good;
    }

    async destroy() {
      const ctx = this.ctx;
      const id = toInt(ctx.params.id);
      const Good = await ctx.model.Good.findById(id);
      if (!Good) {
        ctx.status = 404;
        return;
      }

      await Good.destroy();
      ctx.status = 200;
    }
  }

  module.exports = GoodController;
  