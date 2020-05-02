exports.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'jsyang_admin',
  user: 'root',
  password: ''
};

exports.security = {
  csrf: {
    enable: false,
    ignoreJSON: true
  },
  domainWhiteList: ['*']
};

exports.cors = {
  origin: 'http://localhost',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};

exports.bodyParser = {
  jsonLimit: '5mb',
  formLimit: '6mb',
};
