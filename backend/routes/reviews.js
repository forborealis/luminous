const express = require('express');
const { isAuthenticatedUser } = require('../middleware/auth');
const { createReview, getReviewsByProduct, getUserReviews, updateReview, getReviewById, softDeleteReview, permanentDeleteReview, getDeletedReviews } = require('../controllers/reviews');
const multer = require('../config/multer'); // Multer config for file upload

const router = express.Router();

router.get('/reviews/deleted', isAuthenticatedUser, getDeletedReviews);
router.post('/reviews', isAuthenticatedUser, multer.array('images', 4), createReview);
router.get('/reviews/user', isAuthenticatedUser, getUserReviews); // Move this above
router.get('/reviews/:productId', getReviewsByProduct);
router.put('/reviews/:reviewId', isAuthenticatedUser, multer.array('images', 4), updateReview);
router.put('/reviews/soft-delete/:reviewId', isAuthenticatedUser, softDeleteReview);
router.delete('/reviews/permanent-delete/:reviewId', isAuthenticatedUser, permanentDeleteReview);
router.get('/reviews/review/:reviewId', isAuthenticatedUser, getReviewById);



module.exports = router;
