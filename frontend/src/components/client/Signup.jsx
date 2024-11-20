// src/components/client/Signup.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../firebase/authFunctions'; // Firebase registration function
import AvatarEditorComponent from './AvatarEditor';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { auth, googleProvider } from '../../firebase/firebase'; // Import Firebase config
import { signInWithPopup } from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google Icon

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const avatarEditorRef = useRef(null);

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Save the user information to your backend
      const formData = {
        firebaseUID: user.uid,
        email: user.email,
        username: user.displayName,
        name: user.displayName,
        contactNumber: '',
        address: '',
        avatar: user.photoURL,
        status: 'Verified', // Set status to Verified for Google Sign-Up
      };

      const response = await axios.post('http://localhost:5000/api/v1/register', formData);

      if (response.data.success) {
        // Store the token in local storage
        localStorage.setItem('token', response.data.token);
        toast.success('Google Sign-Up successful!');
        window.dispatchEvent(new Event('loginStateChange')); // Dispatch the event
        navigate('/edit-profile'); // Redirect to edit profile page
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error during Google Sign-Up:', error);
      toast.error('Google Sign-Up failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const avatar = avatarEditorRef.current?.getCroppedImage();

    try {
      const firebaseUser = await registerUser(email, password);

      const formData = {
        firebaseUID: firebaseUser.uid,
        email,
        username,
        name,
        contactNumber,
        address,
        avatar,
      };

      const response = await axios.post('http://localhost:5000/api/v1/register', formData);

      if (response.data.success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        window.dispatchEvent(new Event('loginStateChange')); // Dispatch the event
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.message.includes('already in use')) {
        setError('This email is already registered. Please log in or use a different email.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 font-montserrat text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
              <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border rounded font-montserrat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
          </div>
          <div>
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
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded font-montserrat"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="avatar">
                Upload Avatar
              </label>
              <AvatarEditorComponent ref={avatarEditorRef} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col items-center">
            {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
            <button
              type="submit"
              className="w-2/4 bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
            >
              Sign Up
            </button>
            <button
              onClick={handleGoogleSignUp}
              className="w-2/4 bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 font-montserrat flex items-center justify-center"
            >
              <GoogleIcon className="mr-2" /> Google
            </button>
            <p className="mt-4 text-center font-montserrat">
              Already have an account?{' '}
              <Link to="/login" className="text-coral-red hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;