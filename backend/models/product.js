"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.Stock, { foreignKey: "product_id" });
      Product.hasMany(models.PurchaseRequestItem, { foreignKey: "product_id" });
    }
  }

  Product.init(
    {
      name: DataTypes.STRING,
      sku: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
