const webhookService = require("../services/webhook.service");

const receiveStock = async (req, res) => {
  const payload = req.body;
  const result = await webhookService.processIncomingStock(payload);

  return res.status(200).json({
    status: "success",
    message: "Stock received successfully",
    data: result,
  });
};

module.exports = { receiveStock };
