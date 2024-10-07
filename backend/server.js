// server.js

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware to parse JSON (optional, depends on your use case)
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGO_URI; // Get MongoDB URI from .env file

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if connection fails
  });

// Sample Route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB!');
});

// Start the Server
const PORT = process.env.PORT || 3000; // Use environment variable for PORT, or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
