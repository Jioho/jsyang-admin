
  'use strict';

  module.exports = app => {
    const { STRING, INTEGER, DATE,TEXT,BOOLEAN,DECIMAL } = app.Sequelize;
    const Good = app.model.define('good', {id:{type:INTEGER,primaryKey:true,autoIncrement:true,comment:"商品ID"},title:{type:STRING(50),comment:"商品名称"},category:{type:INTEGER,comment:"商品分类"},img:{type:STRING(250),comment:"商品图片"},detail:{type:TEXT,comment:"年龄"},storeNumber:{type:INTEGER,comment:"库存"},status:{type:INTEGER,comment:"状态"},created_at:{type:DATE,comment:"创建时间"},updated_at:{type:DATE,comment:"更新时间"}});

    return Good;
  };
  