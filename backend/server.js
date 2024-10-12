// server.js

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware to parse JSON (optional, depends on your use case)
app.use(express.json());

// Get MongoDB URI from environment variables
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Your other server code here...
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});