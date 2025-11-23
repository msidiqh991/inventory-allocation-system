const routes = require("express").Router();
const productController = require("../controllers/product.controller");

routes.get("/", productController.getAllProducts);

module.exports = routes;