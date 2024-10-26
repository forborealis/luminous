const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const productRoutes = require('./routes/products');


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Test route
// app.get('/api/v1/test', (req, res) => {
//   res.json({ message: 'Test route is working!' });
// });

// Routes
app.use('/api/v1', auth);
app.use('/api/v1', productRoutes);



module.exports = app;