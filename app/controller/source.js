'use strict';

const Controller = require('egg').Controller;


class SourceController extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    console.log('​SourceController -> upload -> file', file);
    // const name = 'egg-multipart-test/' + path.basename(file.filename);
    let url;
    url = await ctx.service.qiniu.uploadImg(file)
    console.log('​url', url);

    ctx.body = {
      url
    };
  }
  async wangEditorImg() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    console.log('​SourceController -> upload -> file', file);
    let url;
    url = await ctx.service.qiniu.uploadImg(file)
    console.log('​url', url);
    let errno = 0
    if (!url) {
      errno = 1
    }

    ctx.body = {
      errno,
      data: [url]
    };
  }
}

module.exports = SourceController;
