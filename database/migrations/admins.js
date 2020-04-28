
  'use strict';

  module.exports = {
    async up(queryInterface, Sequelize) {
      const { INTEGER, DATE, STRING } = Sequelize;
      await queryInterface.createTable('admins', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(50),
    password: STRING(50),
    created_at: DATE,
    updated_at: DATE
  });
    },
    async down(queryInterface) {
      await queryInterface.dropTable('admins');
    }
  };
  