import React from 'react';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Product from './Products/Product';
import CreateProduct from './Products/CreateProduct'; // Create product page
import UpdateProduct from './Products/UpdateProduct'; // Update product page
import ProductDelete from './Products/ProductDelete';


const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<MainContent />} />
          <Route path="/products" element={<Product />} /> {/* Product DataTable Route */}
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/edit/:id" element={<UpdateProduct />} />
          <Route path="/products/delete" element={<ProductDelete />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
