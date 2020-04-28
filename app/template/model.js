const {firstUpperCase} = require('../extend/helper')
const model = (tabName, structure) => {
  let modelName = firstUpperCase(tabName)
  let result = `
  'use strict';

  module.exports = app => {
    const { STRING, INTEGER, DATE,TEXT,BOOLEAN,DECIMAL } = app.Sequelize;
    const ${modelName} = app.model.define('${tabName}', ${structure});

    return ${modelName};
  };
  `
  return result
}
module.exports =  model
