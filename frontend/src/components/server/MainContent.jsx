import React from 'react';
import { Box, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';


const DashboardPage = () => <Typography variant="h4">Dashboard Page</Typography>;
const ProductsPage = () => <Typography variant="h4">Products Page</Typography>;
const UsersPage = () => <Typography variant="h4">Users Page</Typography>;

const MainContent = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Routes>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        

      </Routes>
    </Box>
  );
};

export default MainContent;