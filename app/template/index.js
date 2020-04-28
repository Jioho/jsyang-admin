const controller = require('./controller');
const migration = require('./migration');
const model = require('./model');
const adminList = require('./adminList');
module.exports = {
  controller,
  migration,
  model,
  ...adminList
};
