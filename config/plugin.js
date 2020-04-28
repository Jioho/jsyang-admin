'use strict';

// had enabled by egg
// exports.static = true;
// exports.assets = {
//   enable: true,
//   package: 'egg-view-assets'
// };

// exports.nunjucks = {
//   enable: true,
//   package: 'egg-view-nunjucks'
// };

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
}
exports.sessionRedis = {
  enable: true,
  package: 'egg-session-redis',
};
