// src/components/client/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../firebase/authFunctions';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { auth, googleProvider } from '../../firebase/firebase'; // Import Firebase config
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
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

      // Check if the user already exists in the backend
      const checkResponse = await axios.post('http://localhost:5000/api/v1/login', formData);

      if (checkResponse.data.success) {
        // User exists, log them in
        localStorage.setItem('token', checkResponse.data.token);
        toast.success('Google Login successful!');
        window.dispatchEvent(new Event('loginStateChange')); // Dispatch the event
        navigate(redirect || '/shop'); // Redirect to dashboard or any other page
      } else {
        // User does not exist, sign them up
        const signupResponse = await axios.post('http://localhost:5000/api/v1/register', formData);

        if (signupResponse.data.success) {
          localStorage.setItem('token', signupResponse.data.token);
          toast.success('Google Sign-Up successful!');
          window.dispatchEvent(new Event('loginStateChange')); // Dispatch the event
          navigate('/edit-profile'); // Redirect to edit profile page
        } else {
          setError(signupResponse.data.message);
        }
      }
    } catch (error) {
      console.error('Error during Google Login:', error);
      toast.error('Google Login failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Hardcoded admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
      toast.success('Logged in as admin');
      return;
    }

    try {
      const firebaseUser = await loginUser(email, password);
      if (!firebaseUser?.uid) {
        setError('Unable to authenticate with Firebase.');
        return;
      }

      console.log("Firebase UID:", firebaseUser.uid); // Debugging line

      const response = await axios.post('http://localhost:5000/api/v1/login', {
        firebaseUID: firebaseUser.uid,
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        window.dispatchEvent(new Event('loginStateChange')); // Dispatch the event
        toast.success('Login successful!');
        navigate(redirect || '/shop');
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  useEffect(() => {
    if (location.state?.unauthorized) {
      toast.error('Unauthorized access.');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-palanquin">Login</h2>
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
          {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
          <button
            type="submit"
            className="w-full bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 font-montserrat"
        >
          Login with Google
        </button>
        <p className="mt-4 text-center font-montserrat">
          Don't have an account?{' '}
          <Link to="/signup" className="text-coral-red hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="mt-2 text-center font-montserrat">
          <Link to="/forgot-password" className="text-coral-red hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;