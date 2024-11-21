const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthenticatedUser = async (req, res, next) => {
  let token;

  // Check if the token is in the Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Check if the token is directly in the headers object
    token = req.headers.token;
  }

  if (!token) {
    console.error('No token provided'); // Debugging log
    return res.status(401).json({ success: false, message: 'Please log in to access this resource' });
  }

  console.log('Token in middleware:', token); // Debugging log

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debugging log
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.error('User not found'); // Debugging log
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Error in isAuthenticatedUser:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }
  next();
};
