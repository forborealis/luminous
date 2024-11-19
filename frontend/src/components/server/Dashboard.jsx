import React from 'react';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Product from './Products/Product';
import CreateProduct from './Products/CreateProduct'; 
import UpdateProduct from './Products/UpdateProduct';
import ProductDelete from './Products/ProductDelete';
import ProtectedAdminRoute from '../ProtectedAdminRoute'; // Import the ProtectedAdminRoute component
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<ProtectedAdminRoute><MainContent /></ProtectedAdminRoute>} />
          <Route path="/products" element={<ProtectedAdminRoute><Product /></ProtectedAdminRoute>} /> {/* Product DataTable Route */}
          <Route path="/products/create" element={<ProtectedAdminRoute><CreateProduct /></ProtectedAdminRoute>} />
          <Route path="/products/update/:id" element={<ProtectedAdminRoute><UpdateProduct /></ProtectedAdminRoute>} />
          <Route path="/products/trash" element={<ProtectedAdminRoute><ProductDelete /></ProtectedAdminRoute>} />
        </Routes>
        <ToastContainer /> {/* Add ToastContainer to display toasts */}
      </Box>
    </Box>
  );
};

export default Dashboard;