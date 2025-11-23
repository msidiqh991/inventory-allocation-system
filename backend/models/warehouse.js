"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    static associate(models) {
      Warehouse.hasMany(models.Stock, { foreignKey: "warehouse_id" });
      Warehouse.hasMany(models.PurchaseRequest, { foreignKey: "warehouse_id" });
    }
  }

  Warehouse.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Warehouse",
    }
  );

  return Warehouse;
};
