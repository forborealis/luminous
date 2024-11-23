const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
  },
  category: {
    type: String,
    enum: ['Lip', 'Blush', 'Foundation', 'Eyeshadow', 'Eyebrow', 'Powder'],
    required: [true, 'Product category is required'],
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    required: true,
  },
  // New fields for review ratings
  totalReviews: {
    type: Number,
    default: 0, // Number of reviews submitted for this product
  },
  averageRating: {
    type: Number,
    default: 0, // Calculated average rating from all reviews
  },
  deleted: {
    type: Boolean,
    default: false, // Mark as not deleted initially
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Function to update average rating after each review
productSchema.statics.updateRating = async function (productId) {
  const reviews = await mongoose.model('Review').find({ productId });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await this.findByIdAndUpdate(productId, {
      totalReviews: reviews.length,
      averageRating,
    });
  } else {
    // If no reviews, reset ratings
    await this.findByIdAndUpdate(productId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

module.exports = mongoose.model('Product', productSchema);
