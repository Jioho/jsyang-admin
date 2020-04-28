const Service = require('egg').Service;
const fs = require('mz/fs');
const path = require('path');
const qiniu = require('qiniu');
const accessKey = 'yJZVuefudvPOEN-uE4jitDOAV-cOEENk69dbd1Pt';
const secretKey = '2it7lnBCiCG33GRQM95Fu18q1OaBUaKSZvCmDo0O';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, config);
config.zone = qiniu.zone.Zone_z2;
var bucket = 'huangyanyang';
class qiniuService extends Service {
  async uploadImg(file) {
    let url;
    try {
      // 处理文件，比如上传到云端
      var options = {
        scope: bucket
      };
      var putPolicy = new qiniu.rs.PutPolicy(options);
      var uploadToken = putPolicy.uploadToken(mac);
      var localFile = file.filepath;
      var formUploader = new qiniu.form_up.FormUploader(config);
      var putExtra = new qiniu.form_up.PutExtra();
      var key = file.filename;
      // 文件上传
      url = await new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, key, localFile, putExtra, function (
          respErr,
          respBody,
          respInfo
        ) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            console.log('respBody', respBody);
            var privateBucketDomain = 'http://qiniu.huangyanyang.cn';
            var deadline = parseInt(Date.now() / 1000) + 3600 * 24 * 30 * 12 * 10; // 10年过期
            let privateDownloadUrl = bucketManager.privateDownloadUrl(
              privateBucketDomain,
              respBody.key,
              deadline
            );
            resolve(privateDownloadUrl);
          } else {
            reject();
            console.log('respInfo.statusCode', respInfo.statusCode);
            console.log('​SourceController -> upload -> respBody', respBody);
          }
        });
      });

      // result = await ctx.oss.put(name, file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }
    return url
  }
}
module.exports = qiniuService;