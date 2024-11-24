const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Cloudinary image URLs
    },
  ],
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  softDeleted: {
    type: Boolean,
    default: false, // By default, reviews are not deleted
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('Review', reviewSchema);
