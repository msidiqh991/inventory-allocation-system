const router = require("express").Router();

router.use('/products', require('./products.routes'));
router.use('/warehouses', require('./warehouse.routes'));
router.use('/stocks', require('./stocks.routes'));
router.use('/webhook', require('./webhook.routes'));
router.use('/purchase/request', require('./purchaseRequest.routes'));

// Base Endpoint
router.get('/', (_req, res) => {
  res.send('Api is working properly!');
});

// Endpoint for non-existing routes
router.get('*', (_req, res) => {
  res.status(404).json({ message: 'Endpoint Not Found' });
});

module.exports = router;