import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { authenticate, getToken } from '../../utils/helpers';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!username) {
      setError('Username is required.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    await authenticate(username, password, navigate, setError);
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      navigate(redirect || '/shop');
    }
  }, [navigate, redirect]);

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
            <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border rounded font-montserrat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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