import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AvatarEditorComponent from './AvatarEditor'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const avatarEditorRef = useRef(null);
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
          const { email, name, contactNumber, address, avatar } = response.data.user;
          console.log('Fetched user data:', response.data.user); 
          setEmail(email);
          setName(name);
          setContactNumber(contactNumber);
          setAddress(address);
          setAvatar(avatar.url); 
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAvatar = avatarEditorRef.current.getCroppedImage();

    const formData = {
      email,
      name,
      contactNumber,
      address,
      avatar: updatedAvatar 
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL; 
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const headers = {
        Authorization: `Bearer ${token}`
      };
      console.log('Request Headers:', headers); 
      const response = await axios.put(`${apiUrl}/user`, formData, { headers });

      if (response.data.success) {
        toast.success('Profile updated successfully!'); 
        navigate('/profile'); 
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error updating user data:', error); 
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-palanquin">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="contactNumber">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="avatar">
              Upload Avatar
            </label>
            {avatar && (
              <div class="mb-4">
                <img src={avatar} alt="Current Avatar" className="w-24 h-24 rounded-full mx-auto" />
              </div>
            )}
            <AvatarEditorComponent ref={avatarEditorRef} initialImage={avatar} />
          </div>
          {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
          <button
            type="submit"
            className="w-full bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;