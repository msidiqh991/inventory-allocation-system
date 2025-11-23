"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PurchaseRequest extends Model {
    static associate(models) {
      PurchaseRequest.belongsTo(models.Warehouse, {
        foreignKey: "warehouse_id",
      });
      PurchaseRequest.hasMany(models.PurchaseRequestItem, {
        foreignKey: "purchase_request_id",
      });
    }
  }

  PurchaseRequest.init(
    {
      reference: DataTypes.STRING,
      warehouse_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PurchaseRequest",
    }
  );

  return PurchaseRequest;
};
