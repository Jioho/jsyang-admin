
  'use strict';

  const Controller = require('egg').Controller;
  function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
  }

  class StudentController extends Controller {
    async index() {
      const ctx = this.ctx;
      const query = {
        limit: toInt(ctx.query.limit),
        offset: toInt(ctx.query.offset),
        order: [['id', 'DESC']]
      };
      let result = await ctx.model.Student.findAll(query);
      ctx.body = {
        list: result,
        pagination: {}
      };
    }

    async show() {
      const ctx = this.ctx;
      ctx.body = await ctx.model.Student.findById(toInt(ctx.params.id));
    }

    async create() {
      const ctx = this.ctx;
      const Student = await ctx.model.Student.create(ctx.request.body);
      ctx.status = 201;
      ctx.body = Student;
    }

    async update() {
      const ctx = this.ctx;
      const id = toInt(ctx.params.id);
      const Student = await ctx.model.Student.findById(id);
      if (!Student) {
        ctx.status = 404;
        return;
      }

      const { sid,sex,age,telphone,score } = ctx.request.body;
      await Student.update({ sid,sex,age,telphone,score });
      ctx.body = Student;
    }

    async destroy() {
      const ctx = this.ctx;
      const id = toInt(ctx.params.id);
      const Student = await ctx.model.Student.findById(id);
      if (!Student) {
        ctx.status = 404;
        return;
      }

      await Student.destroy();
      ctx.status = 200;
    }
  }

  module.exports = StudentController;
  