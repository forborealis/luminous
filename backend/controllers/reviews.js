const Review = require('../models/review');
const Product = require('../models/products');
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
exports.createReview = async (req, res) => {
    try {
      console.log('Request Body:', req.body);
      console.log('Files Received:', req.files);
  
      const { productId, reviewText, rating } = req.body;
      const userId = req.user.id;
  
      if (!productId || !reviewText || !rating) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Upload files to Cloudinary
      const uploadedImages = req.files?.length
        ? await uploadToCloudinary(req.files)
        : [];
  
      console.log('Uploaded Images:', uploadedImages);
  
      // Create review in the database
      const review = await Review.create({
        productId,
        userId,
        reviewText,
        images: uploadedImages,
        rating,
      });
  
      // Update the product's rating
      await Product.updateRating(productId);
  
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

    const reviews = await Review.find({ productId }).populate('userId', 'name avatar');
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

