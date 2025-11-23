const { Stock, Product, Warehouse } = require("../../models");

const getAllStocks = async () => {
  return await Stock.findAll({
    include: [
      { model: Product, attributes: ["id", "name", "sku"] },
      { model: Warehouse, attributes: ["id", "name"] },
    ],
  });
};

module.exports = { getAllStocks };
