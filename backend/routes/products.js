const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  permanentlyDeleteProduct,
  getDeletedProducts // Add the function here
} = require('../controllers/ProductController');

const multer = require('../config/multer'); // Import multer configuration

router.get('/products/deleted', getDeletedProducts); // Route to fetch deleted products
router.post('/products', multer.array('images', 4), createProduct);
router.put('/products/:id', multer.array('images', 4), updateProduct);
router.get('/products/:id', getProductById);
router.get('/products', getProducts);
router.delete('/products/:id', softDeleteProduct); // Soft delete route
router.put('/products/restore/:id', restoreProduct); // Restore product route
router.delete('/products/permanent/:id', permanentlyDeleteProduct); // Permanent delete route

module.exports = router;
