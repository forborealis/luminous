// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/transaction');

router.get('/sales', salesController.getSalesData);

module.exports = router;