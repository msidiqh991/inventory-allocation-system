const routes = require('express').Router();
const stocksController = require('../controllers/stocks.controller');

routes.get('/', stocksController.getAllStocks);

module.exports = routes;
