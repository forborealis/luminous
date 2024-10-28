import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL; 
        const headers = {
          Authorization: `Bearer ${token}`
        };
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
  }, [token]);

  if (isAuthorized === false) {
    return <Navigate to="/login" state={{ unauthorized: true }} />;
  }

  return isAuthorized ? Component : null;
};

export default ProtectedRoute;