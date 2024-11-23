const express = require('express');
const { isAuthenticatedUser } = require('../middleware/auth');
const { createReview, getReviewsByProduct } = require('../controllers/reviews');
const multer = require('../config/multer'); // Multer config for file upload

const router = express.Router();

router.post('/reviews', isAuthenticatedUser, multer.array('images', 4), createReview);
router.get('/reviews/:productId', getReviewsByProduct);

module.exports = router;
