import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL; 
        const token = localStorage.getItem('token');
        console.log('Token:', token); 
        console.log('API URL:', apiUrl); 
        if (!token) {
          throw new Error('No token found');
        }
        const headers = {
          Authorization: `Bearer ${token}`
        };
        console.log('Request Headers:', headers); 
        const response = await axios.get(`${apiUrl}/user`, { headers });

        if (response.data.success) {
          console.log('Fetched user data:', response.data.user); 
          setUser(response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error); 
        setError('An error occurred. Please try again.');
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-palanquin">Profile</h2>
        {user.avatar && (
          <div className="mb-4 flex justify-center">
            <img src={user.avatar.url} alt="Avatar" className="w-24 h-24 rounded-full" />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat">Email</label>
          <p className="w-full px-3 py-2 border rounded font-montserrat">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat">Name</label>
          <p className="w-full px-3 py-2 border rounded font-montserrat">{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat">Contact Number</label>
          <p className="w-full px-3 py-2 border rounded font-montserrat">{user.contactNumber}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-montserrat">Address</label>
          <p className="w-full px-3 py-2 border rounded font-montserrat">{user.address}</p>
        </div>
        {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
        <button
          onClick={handleEditProfile}
          className="w-full bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;