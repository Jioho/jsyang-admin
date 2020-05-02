
  'use strict';

  module.exports = app => {
    const { STRING, INTEGER, DATE,TEXT,BOOLEAN,DECIMAL } = app.Sequelize;
    const Student = app.model.define('student', {id:{type:INTEGER,primaryKey:true,autoIncrement:true,comment:"学生ID"},sid:{type:STRING(50),comment:"学号"},sex:{type:INTEGER,comment:"性别"},age:{type:INTEGER,comment:"年龄"},telphone:{type:STRING(20),comment:"电话号码"},score:{type:INTEGER,comment:"学分"},created_at:{type:DATE,comment:"创建时间"},updated_at:{type:DATE,comment:"更新时间"}});

    return Student;
  };
  