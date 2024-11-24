const Review = require('../models/review');
const Product = require('../models/products');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;



// Upload image to Cloudinary
const uploadToCloudinary = async (files) => {
    const uploadedImages = [];
  
    for (const file of files) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'reviews' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error('Cloudinary upload failed'));
            } else {
              console.log('Cloudinary upload successful:', result.secure_url);
              resolve(result.secure_url);
            }
          }
        );
  
        // Pass the file buffer to the stream
        stream.end(file.buffer);
      });
  
      // Wait for the current file to finish uploading
      const imageUrl = await uploadPromise;
      uploadedImages.push(imageUrl);
    }
  
    return uploadedImages;
  };
  
  

// Create a review
// Create a review
exports.createReview = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Files Received:', req.files);

    const { productId, reviewText, rating } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!productId || !reviewText || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Upload images to Cloudinary if any
    const uploadedImages = req.files?.length
      ? await uploadToCloudinary(req.files)
      : [];

    console.log('Uploaded Images:', uploadedImages);

    // Create the review in the database
    const review = await Review.create({
      productId,
      userId,
      reviewText,
      images: uploadedImages,
      rating,
    });

    // Recalculate the product's average rating and total reviews
    const validReviews = await Review.find({
      productId,
      softDeleted: { $ne: true },
    });

    const totalReviews = validReviews.length;
    const averageRating =
      totalReviews > 0
        ? validReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Update the product with the new average rating and total reviews
    await Product.findByIdAndUpdate(productId, {
      totalReviews,
      averageRating,
    });

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

  

// Get reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (productId === "all") {
      const reviews = await Review.find({ softDeleted: { $ne: true } }) // Exclude soft-deleted reviews
        .populate("userId", "name avatar")
        .populate("productId", "name images");
      return res.status(200).json({ reviews });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ productId, softDeleted: { $ne: true } }) // Exclude soft-deleted reviews
      .populate("userId", "name avatar")
      .populate("productId", "name images");
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Fetch reviews for the logged-in user
exports.getUserReviews = async (req, res) => {
  try {
    console.log('Fetching reviews for user:', req.user.id);
    const userId = req.user.id;
    const reviews = await Review.find({ userId }).populate('productId', 'name images');
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    console.log('Received reviewId:', reviewId); // Debug log

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    // Query using the _id field
    const review = await Review.findById(reviewId).populate('productId', 'name images');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reviewText, rating } = req.body;

    // Validate review ID
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the logged-in user is authorized to update this review
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }

    // Handle uploaded images if any
    if (req.files) {
      const uploadedImages = await uploadToCloudinary(req.files);
      review.images = uploadedImages;
    }

    // Update review fields
    review.reviewText = reviewText;
    review.rating = rating;

    // Save the updated review
    await review.save();

    // Recalculate the product's average rating and total reviews
    const productId = review.productId;
    const validReviews = await Review.find({
      productId,
      softDeleted: { $ne: true },
    });

    const totalReviews = validReviews.length;
    const averageRating =
      totalReviews > 0
        ? validReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Update product details
    await Product.findByIdAndUpdate(productId, {
      totalReviews,
      averageRating,
    });

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Soft Delete a Review
exports.softDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { softDeleted: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate product rating and total reviews after soft deletion
    const productId = review.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch all non-deleted reviews for this product
    const validReviews = await Review.find({
      productId: productId,
      softDeleted: { $ne: true },
    });

    const totalReviews = validReviews.length;
    const averageRating =
      totalReviews > 0
        ? validReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Update the product's totalReviews and averageRating
    product.totalReviews = totalReviews;
    product.averageRating = averageRating;
    await product.save();

    res.status(200).json({ message: 'Review soft deleted successfully', review });
  } catch (error) {
    console.error('Error soft deleting review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Permanently Delete a Review
exports.permanentDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate product rating and total reviews after permanent deletion
    const productId = review.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch all non-deleted reviews for this product
    const validReviews = await Review.find({
      productId: productId,
      softDeleted: { $ne: true },
    });

    const totalReviews = validReviews.length;
    const averageRating =
      totalReviews > 0
        ? validReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Update the product's totalReviews and averageRating
    product.totalReviews = totalReviews;
    product.averageRating = averageRating;
    await product.save();

    res.status(200).json({ message: 'Review permanently deleted', review });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fetch Soft-Deleted Reviews

exports.getDeletedReviews = async (req, res) => {
  try {
    // Fetch reviews where softDeleted is true and populate user and product details
    const reviews = await Review.find({ softDeleted: true })
      .populate('userId', 'name') // Populate user's name
      .populate('productId', 'name images'); // Populate product's name and images

    // Send populated reviews to the frontend
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching deleted reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


