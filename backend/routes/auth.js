const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, getUserProfile, updateUserProfile, updateUserPassword } = require('../controllers/auth');
const { isAuthenticatedUser } = require('../middleware/auth');

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/user', isAuthenticatedUser, getUserProfile);
router.put('/user', isAuthenticatedUser, updateUserProfile); 
router.put('/user/password', isAuthenticatedUser, updateUserPassword);
router.get('/shop', isAuthenticatedUser, (req, res) => {
  res.status(200).json({ success: true, message: 'Access granted' });
}); // Protected /shop route

module.exports = router;