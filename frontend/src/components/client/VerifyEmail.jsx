import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      if (!token) {
        setMessage('Invalid or missing token');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/v1/verify-email?token=${token}`);
        if (response.data.success) {
          toast.success('Account verified! You can now log in.'); // Show toast notification
          setTimeout(() => {
            navigate('/login');
          }, 2000); // Redirect to login after 3 seconds
        }
      } catch (error) {
        setMessage('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-palanquin">Email Verification</h2>
        <p className="text-center font-montserrat">{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;