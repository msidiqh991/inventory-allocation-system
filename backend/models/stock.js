"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {
      Stock.belongsTo(models.Product, { foreignKey: "product_id" });
      Stock.belongsTo(models.Warehouse, { foreignKey: "warehouse_id" });
    }
  }

  Stock.init(
    {
      warehouse_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );

  return Stock;
};
