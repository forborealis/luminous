const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  username: {
    type: String,
    required: [true, 'Please enter your username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
  },
  contactNumber: {
    type: String,
    required: [true, 'Please enter your contact number'],
  },
  address: {
    type: String,
    required: [true, 'Please enter your address'],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Prevent redefinition by checking for an existing model
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
