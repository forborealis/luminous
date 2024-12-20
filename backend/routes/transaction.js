const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  checkout,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  getTotalOrders,
  getCompletedOrders,
} = require('../controllers/transaction');

// Cart routes
router.post('/cart', isAuthenticatedUser, addToCart);
router.get('/cart', isAuthenticatedUser, getCart);
router.put('/cart', isAuthenticatedUser, updateCartItem);
router.delete('/cart', isAuthenticatedUser, removeFromCart);

// Checkout route
router.post('/checkout', isAuthenticatedUser, checkout);

// Orders route
router.get('/orders/user', isAuthenticatedUser, getUserOrders);
router.get('/orders/total', getTotalOrders);
router.get('/completed-orders', isAuthenticatedUser, getCompletedOrders);



// OrderTable route
router.put('/orders/status', isAuthenticatedUser, updateOrderStatus);

router.get('/admin/orders', isAuthenticatedUser, getAllOrders);



module.exports = router;
