// src/components/ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Retrieve the user's role from local storage

  if (!token || userRole !== 'Admin') {
    // Show toast notification
    toast.error('Unauthorized access. Admins only.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Redirect to the home page or login page
    return <Navigate to="/shop" />;
  }

  return children;
};

export default ProtectedAdminRoute;
