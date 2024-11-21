// controllers/ProductController.js
const mongoose = require('mongoose');
const Product = require('../models/products');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload an image to Cloudinary using a buffer
const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// Create a product and handle image upload
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload up to 4 images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer))
    );

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: uploadedImages, // Store Cloudinary URLs
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product." });
  }
};

// Get all products
// Get all products with an optional stock filter
exports.getAllProducts = async (req, res) => {
  try {
    const { filterStock } = req.query; // Check if stock filtering is required
    let query = { deleted: false };

    // If filterStock is true, only include products with stock greater than 0
    if (filterStock === 'true') {
      query.stock = { $gt: 0 };
    }

    const products = await Product.find(query);
    const categoryOptions = Product.schema.path('category').enumValues;
    res.json({ products, categoryOptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsForInfiniteScroll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const products = await Product.find({ deleted: false }).skip(skip).limit(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: 'Error retrieving product' });
  }
};

exports.getDeletedProducts = async (req, res) => {
  try {
    console.log("Fetching deleted products from database...");
    const deletedProducts = await Product.find({ deleted: true });
    console.log("Deleted products fetched:", deletedProducts);
    res.status(200).json({ products: deletedProducts });
  } catch (error) {
    console.error("Error fetching deleted products:", error.message);
    res.status(500).json({ message: "Error retrieving deleted products" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Upload new images if provided
    let uploadedImages = [];
    if (req.files) {
      uploadedImages = await Promise.all(req.files.map((file) => uploadImage(file.buffer)));
    }

    // Update product
    const updatedData = {
      name,
      description,
      price,
      category,
      stock,
      ...(uploadedImages.length && { images: uploadedImages }),
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating product.' });
  }
};

// Soft delete product
exports.softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error soft deleting product:", error);
    res.status(500).json({ message: "Error deleting product." });
  }
};

// Restore product
exports.restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error restoring product:", error);
    res.status(500).json({ message: "Error restoring product." });
  }
};

// Permanently delete product
exports.permanentDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting product:", error);
    res.status(500).json({ message: "Error permanently deleting product." });
  }
};