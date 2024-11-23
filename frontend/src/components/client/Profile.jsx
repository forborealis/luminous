import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'; 
import Avatar from '@mui/material/Avatar'; 

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'; 
        const token = localStorage.getItem('token');
        console.log('Token:', token); 
        console.log('API URL:', apiUrl); 
        if (!token) {
          throw new Error('No token found');
        }
        const headers = {
          Authorization: `Bearer ${token}`
        };
        const response = await axios.get(`${apiUrl}/user`, { headers });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100 font-montserrat mt-12 mb-12"> {/* Added margin-top and margin-bottom */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg relative"> {/* Increased max-width */}
        <div className="absolute top-0 left-0 w-full h-32 bg-pale-blue rounded-t-lg"></div> {/* Background image */}
        <div className="flex justify-center mb-6 relative z-10">
          <Avatar
            alt={user.username}
            src={user.avatar?.url}
            sx={{ width: 100, height: 100, marginTop: '4rem', border: '4px solid white' }} // Adjusted margin and border
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 font-montserrat text-center">@{user.username}</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={user.name}
            className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="contactNumber">
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            value={user.contactNumber}
            className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={user.address}
            className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
            disabled
          />
        </div>
        {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
        <Button
          variant="contained"
          fullWidth
          className="font-montserrat"
          sx={{
            backgroundColor: 'coral-red',
            '&:hover': {
              backgroundColor: 'coral-red-dark',
            },
          }}
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;