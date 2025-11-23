const routes = require("express").Router();
const purchaseRequestController = require("../controllers/purchaseRequest.controller");

routes.post("/", purchaseRequestController.create);
routes.get("/", purchaseRequestController.getAll);
routes.get("/:id", purchaseRequestController.getById);
routes.put("/:id", purchaseRequestController.update);
routes.delete("/:id", purchaseRequestController.remove);

module.exports = routes;