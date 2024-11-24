import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send reset password request via backend
      const response = await axios.post('http://localhost:5000/api/v1/reset-password', { token, newPassword });

      if (response.data.success) {
        toast.success('Password updated successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Delay navigation to allow toast to be visible
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat mt-12 mb-12"> {/* Added margin-top and margin-bottom */}
      <ToastContainer /> {/* Add ToastContainer to display toasts */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 font-montserrat text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-coral-red text-white py-2 rounded-lg hover:bg-coral-red-dark font-montserrat" // Rounded edges
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;