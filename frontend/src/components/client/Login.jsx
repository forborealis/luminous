// src/components/client/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

  const auth = getAuth(); // Firebase Auth instance
  const googleProvider = new GoogleAuthProvider(); // Firebase Google provider

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // Redirect based on role
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/shop');
      }
    }
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const formData = {
        firebaseUID: user.uid,
        email: user.email,
        username: user.displayName,
        name: user.displayName,
        avatar: user.photoURL,
        status: 'Verified',
      };

      const response = await axios.post('http://localhost:5000/api/v1/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('firebaseUID', user.uid); // Store Firebase UID
        toast.success('Google Login successful!');
        window.dispatchEvent(new Event('loginStateChange'));

        if (response.data.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect || '/shop');
        }
      }
    } catch (error) {
      console.error('Error during Google Login:', error);
      setError('Google Login failed. Please try again.');
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      // Authenticate using Firebase
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const firebaseUser = userCredential.user;

      // Firebase authentication successful
      const formData = {
        firebaseUID: firebaseUser.uid,
        email: firebaseUser.email,
        password: values.password, // Include password if required by the backend
      };

      // Send the user data to the backend for role and token validation
      const response = await axios.post('http://localhost:5000/api/v1/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        // Save token, role, and Firebase UID in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('firebaseUID', firebaseUser.uid); // Store Firebase UID
        window.dispatchEvent(new Event('loginStateChange'));

        // Redirect based on user role
        if (response.data.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/shop');
        }
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Error during login:', error);

      // Log detailed error response
      if (error.response && error.response.data) {
        console.error('Backend Error:', error.response.data);
        setError(error.response.data.message || 'Login failed.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
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
        <h2 className="text-2xl font-semibold mb-6 font-montserrat text-center">Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="email">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded font-montserrat"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 font-montserrat" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="password">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded font-montserrat"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 font-montserrat" />
              </div>
              {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
              <button
                type="submit"
                className="w-full bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
                disabled={isSubmitting}
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded mt-3 hover:bg-blue-600 font-montserrat flex items-center justify-center"
        >
          <GoogleIcon className="mr-2" /> Google
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
