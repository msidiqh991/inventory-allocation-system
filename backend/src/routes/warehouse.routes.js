const routes = require("express").Router();
const warehouseController = require("../controllers/warehouse.controller");

routes.get("/", warehouseController.getAllWarehouses);

module.exports = routes;