const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, getUserProfile, updateUserProfile, updateUserPassword, forgotPassword, resetPassword , saveFcmToken ,   sendNotification, getTotalVerifiedUsers,  } = require('../controllers/auth');
const { isAuthenticatedUser } = require('../middleware/auth');


router.post("/users/save-fcm-token", isAuthenticatedUser, saveFcmToken);
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/user', isAuthenticatedUser, getUserProfile);
router.put('/user', isAuthenticatedUser, updateUserProfile); 
router.put('/user/password', isAuthenticatedUser, updateUserPassword);
router.get('/users/verified', getTotalVerifiedUsers);
router.post('/send-notification', isAuthenticatedUser, sendNotification);
router.get('/shop', isAuthenticatedUser, (req, res) => {
  res.status(200).json({ success: true, message: 'Access granted' });
}); // Protected /shop route

module.exports = router;