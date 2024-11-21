const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const adminSetup = require('./utils/adminSetup'); // Utility to handle admin creation

// Load environment variables
dotenv.config({ path: './config/.env' });

// Connect to database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure admin user exists
adminSetup();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
