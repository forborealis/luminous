import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('Token is required');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL; // Use Vite's import.meta.env
      const response = await axios.post(`${apiUrl}/reset-password`, { token, newPassword });

      if (response.data.success) {
        toast.success('Password reset successfully.');
        setMessage('Password reset successfully. You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect to login page after 2 seconds
      } else {
        toast.error(response.data.message);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred. Please try again.');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-palanquin">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="token">
              Token
            </label>
            <input
              type="text"
              id="token"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-center font-montserrat">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;