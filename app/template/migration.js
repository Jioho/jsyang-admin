const Inflector = require('inflected');
const migration = (tabName, structure) => {
  let tabNames = Inflector.pluralize(tabName);
  let result = `
  'use strict';

  module.exports = {
    async up(queryInterface, Sequelize) {
      const { INTEGER, DATE, STRING,TEXT,BOOLEAN,DECIMAL } = Sequelize;
      await queryInterface.createTable('${tabNames}', ${structure});
    },
    async down(queryInterface) {
      await queryInterface.dropTable('${tabNames}');
    }
  };
  `
  return result
}
module.exports = migration
