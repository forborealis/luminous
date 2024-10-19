const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.memoryStorage(), // Use memory storage
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('Unsupported file type!'), false);
      return;
    }
    cb(null, true);
  }
});