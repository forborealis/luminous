import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Redirect if no token or role isn't admin
    if (!token || role !== 'Admin') {
      navigate('/login');
    } else {
      // Simulate data fetching or initialization
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Adjust timeout as needed
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <p>Loading Dashboard...</p>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<ProtectedAdminRoute><MainContent /></ProtectedAdminRoute>} />
          <Route path="/products" element={<ProtectedAdminRoute><Product /></ProtectedAdminRoute>} />
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
