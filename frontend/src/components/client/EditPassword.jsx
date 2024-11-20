import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase'; 
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Button from '@mui/material/Button'; 

const EditPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password cannot be the same as the current password.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in.');
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      toast.success('Password updated successfully! Please log in again.');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-montserrat text-center">Edit Password</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="font-montserrat"
            sx={{
              backgroundColor: 'coral-red',
              '&:hover': {
                backgroundColor: 'coral-red-dark',
              },
            }}
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditPassword;