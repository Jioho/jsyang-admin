'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1540393129487_1707';

  // add your config here
  config.middleware = ['errorHandler'];
  config.errorHandler = {
    match: '/api'
  };
  config.view = {
    mapping: {
      '.html': 'nunjucks'
    }
  };


  config.security = {
    csrf: false
  };

  config.static = {
    prefix: '/'
  };

  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'jsyang_admin',
    user: 'root',
    password: 'huangyanyang'
    // password: null
  };

  // 覆盖egg自带的配置
  config.bodyParser = {
    enable: true,
    encoding: 'utf8',
    // formLimit: '100kb',
    // jsonLimit: '100kb',
    jsonLimit: '5mb',
    formLimit: '6mb',
    strict: true,
    // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
    queryString: {
      arrayLimit: 100,
      depth: 5,
      parameterLimit: 1000
    },
    enableTypes: ['json', 'form', 'text'],
    extendTypes: {
      text: ['text/xml', 'application/xml']
    }
  };
  // config.redis = {
  //   client: {
  //     port: 6489,          // Redis port
  //     host: '127.0.0.1',   // Redis host
  //     password: '.',
  //     db: 0,
  //   },
  // }
  exports.multipart = {
    mode: 'file'
  };
  exports.jwtKey = 'jwtKey.'

  return config;
};
