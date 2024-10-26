const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please log in to access this resource' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    console.error('Error in isAuthenticatedUser:', error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};