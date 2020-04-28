
  'use strict';

  module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;
    const Admin = app.model.define('admin', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(50),
    password: STRING(50),
    created_at: DATE,
    updated_at: DATE
  });

    return Admin;
  };
  