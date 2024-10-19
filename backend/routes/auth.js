const express = require('express');
const { registerUser, verifyEmail } = require('../controllers/auth');
const upload = require('../config/multer');
const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);
router.get('/verify-email', verifyEmail);

module.exports = router;