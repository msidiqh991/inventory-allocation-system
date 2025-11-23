const routes = require("express").Router();
const webhookController = require("../controllers/webhook.controller");

routes.post("/receive-stock", webhookController.receiveStock);

module.exports = routes;