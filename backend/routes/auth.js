const express = require('express');
const { registerUser, verifyEmail, loginUser } = require('../controllers/auth');
const { isAuthenticatedUser } = require('../middleware/auth');
const upload = require('../config/multer');
const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/shop', isAuthenticatedUser, (req, res) => {
  res.status(200).json({ success: true, message: 'Access granted' });
});

module.exports = router;