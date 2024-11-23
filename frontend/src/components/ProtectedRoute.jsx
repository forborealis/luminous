import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Use the correct endpoint here
        const response = await axios.get(`${apiUrl}/user`, { headers });

        if (response.data.success && response.data.user.role === 'user') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAuthorized(false);
      }
    };

    fetchUserData();
  }, [token, apiUrl]);

  if (isAuthorized === false) {
    return <Navigate to="/login" state={{ unauthorized: true }} />;
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;