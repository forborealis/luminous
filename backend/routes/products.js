// routes/products.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const upload = require('../config/multer'); // Import the multer configuration

// Apply upload middleware for handling multiple images (up to 4)
router.post('/products', upload.array('images', 4), productController.createProduct);

// Order matters here. Place `/products/deleted` before `/products/:id`
router.get('/products/deleted', productController.getDeletedProducts);
router.get('/products', productController.getAllProducts);
router.get('/products/search', productController.getProductsForSearch); // Client-side search route
router.put('/products/:id', upload.array('images', 4), productController.updateProduct);
router.put('/products/:id/soft-delete', productController.softDeleteProduct);
router.put('/products/:id/restore', productController.restoreProduct);
router.delete('/products/:id', productController.permanentDeleteProduct);
router.get('/products', productController.getTotalProducts);

router.get('/products/infinite-scroll', productController.getProductsForInfiniteScroll);
router.get('/products/:id', productController.getProductById);  // This should be last among these routes

module.exports = router;