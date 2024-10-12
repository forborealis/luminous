const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Lip', 'Foundation', 'Eyeshadow', 'Mascara', 'Blush', 'Other'], 
  },
  colors: [{
    type: String,
    required: true,
  }],
  images: [{
    public_id: {
      type: String,
      required: true, 
    },
    url: {
      type: String,
      required: true, // URL to access the image
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,  
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0, 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
