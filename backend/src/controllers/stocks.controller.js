const stockService = require("../services/stock.service");

const getAllStocks = async (req, res) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.status(200).json({
      status: "success",
      message: "Stocks retrieved successfully",
      data: stocks,
    })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllStocks };
