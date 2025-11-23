"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PurchaseRequestItem extends Model {
    static associate(models) {
      PurchaseRequestItem.belongsTo(models.PurchaseRequest, {
        foreignKey: "purchase_request_id",
      });
      PurchaseRequestItem.belongsTo(models.Product, {
        foreignKey: "product_id",
      });
    }
  }

  PurchaseRequestItem.init(
    {
      purchase_request_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PurchaseRequestItem",
    }
  );

  return PurchaseRequestItem;
};
