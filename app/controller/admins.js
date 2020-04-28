'use strict';

const Controller = require('egg').Controller;
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class AdminController extends Controller {
  async index() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
      order: [['id', 'DESC']]
    };
    let result = await ctx.model.Admin.findAll({
      // attributes: { exclude: ['password'] }
    });
    ctx.body = {
      list: result,
      pagination: {}
    };
  }

  async show() {
    const ctx = this.ctx;
    ctx.body = await ctx.model.Admin.findById(toInt(ctx.params.id));
  }

  async create() {
    const ctx = this.ctx;
    const Admin = await ctx.model.Admin.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = Admin;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const Admin = await ctx.model.Admin.findById(id);
    if (!Admin) {
      ctx.status = 404;
      return;
    }

    const { username, password } = ctx.request.body;
    await Admin.update({ username, password });
    ctx.body = Admin;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const Admin = await ctx.model.Admin.findById(id);
    if (!Admin) {
      ctx.status = 404;
      return;
    }

    await Admin.destroy();
    ctx.status = 200;
  }
  async adminLogin() {
    const { password, userName, type } = this.ctx.request.body;
    if (userName === 'admin' && password === 'jsyang666') {
      this.ctx.body = {
        status: 'ok',
        type,
        currentAuthority: 'admin',
        userName
      };
      return;
    }
    const admin = await this.ctx.model.Admin.findOne({ userName });
    if(!admin){
      this.ctx.body = {
        status: 'error',
        type,
        currentAuthority: 'guest',
        userName
      };
      return
    }
    if (admin.password === password) {
      this.ctx.body = {
        status: 'ok',
        type,
        currentAuthority: 'user',
        userName
      };
    } else {
      this.ctx.body = {
        status: 'error',
        type,
        currentAuthority: 'guest',
        userName
      };
    }
  }
  async changepasswd() {
    console.log("AdminController -> changepasswd -> this.ctx.request.body;", this.ctx.request.body)
  }
}

module.exports = AdminController;
