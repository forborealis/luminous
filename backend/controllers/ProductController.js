const Product = require('../models/products');
const cloudinary = require('cloudinary').v2;

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(file.buffer);
        });
        images.push(result.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: 0,
      images
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ deleted: false }); // Fetch only non-deleted products
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Deleted Products (For Trash page)
exports.getDeletedProducts = async (req, res) => {
  try {
    const products = await Product.find({ deleted: true });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching deleted products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const productId = req.params.id;
    let updatedProductData = { name, description, price, category };

    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(file.buffer);
        });
        images.push(result.secure_url);
      }

      updatedProductData.images = images;
    }

    const product = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Product (Move to Trash)
exports.softDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(productId, { deleted: true }, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product moved to trash', product });
  } catch (error) {
    console.error('Error soft deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Restore Product from Trash
exports.restoreProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(productId, { deleted: false }, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product restored', product });
  } catch (error) {
    console.error('Error restoring product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Permanently Delete Product
exports.permanentlyDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product permanently deleted' });
  } catch (error) {
    console.error('Error permanently deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
