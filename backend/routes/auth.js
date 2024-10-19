const express = require('express');
const { registerUser } = require('../controllers/auth');
const upload = require('../config/multer');
const router = express.Router();

router.post('/register', upload.single('avatar'), registerUser);

module.exports = router;