import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

const Shop = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please log in to access this page');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/v1/shop', {
          headers: { token }
        });

        if (!response.data.success) {
          toast.error('Please log in to access this page');
          navigate('/login');
        }
      } catch (error) {
        toast.error('Please log in to access this page');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div>
      <h1>Shop Home Page</h1>
      {/* Add your shop home page content here */}
    </div>
  );
};

export default Shop;