// src/components/client/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { requestFCMToken } from "../../firebase/fcmFunction";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import GoogleIcon from '@mui/icons-material/Google';
import loginImage from '../../assets/images/login-image.jpg'; 

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
      } else {
        setError(response.data.message);
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
    setError(''); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const firebaseUser = userCredential.user;
  
      // Dynamically request a fresh FCM token
      let fcmToken;
      try {
        fcmToken = await requestFCMToken();
      } catch (error) {
        console.error("Error generating FCM token:", error);
        setError("Failed to generate FCM token. Please enable notifications.");
        return;
      }
  
      // Prepare user data for backend
      const formData = {
        firebaseUID: firebaseUser.uid,
        email: firebaseUser.email,
        password: values.password,
      };
  
      // Send the user data to the backend for login
      const response = await axios.post('http://localhost:5000/api/v1/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.data.success) {
        // Save tokens and role in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('firebaseUID', firebaseUser.uid);
  
        // Save the FCM token to the backend
        try {
          await axios.post(
            'http://localhost:5000/api/v1/users/save-fcm-token',
            {
              firebaseUID: firebaseUser.uid,
              fcmToken,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${response.data.token}`,  // Include the JWT token
              },
            }
          );
        } catch (saveTokenError) {
          console.error("Failed to save FCM token:", saveTokenError);
          toast.error("FCM token could not be saved. Notifications may not work.");
        }
  
        toast.success('Login successful!');
        window.dispatchEvent(new Event('loginStateChange')); // Trigger a login state change
  
        // Redirect user based on role
        if (response.data.role === 'Admin') {
          navigate('/admin/chart');
        } else {
          navigate('/shop');
        }
      } else {
        setError(response.data.message); // Handle backend errors
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Login failed. Please try again.');
    } finally {
      setSubmitting(false); // Stop submitting state
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
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-4xl">
        <div className="w-1/2 hidden md:block">
          <img src={loginImage} alt="Login" className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back!</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
                <div className="mb-4 relative">
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
                <div className="flex justify-end mb-4">
                  <Link to="/forgot-password" className="text-black text-sm">
                    Forgot Password?
                  </Link>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-dark-pink text-white py-2 rounded hover:bg-coral-red"
                  disabled={isSubmitting}
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-pale-blue text-white py-2 rounded hover:bg-pale-blue flex items-center justify-center"
            >
              <GoogleIcon className="mr-2" /> Google
            </button>
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-coral-red hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
<div className="mt-6 flex justify-between">
  <button
    onClick={() => navigate('/completed-orders')}
    className="w-1/2 bg-green-500 text-white py-2 rounded hover:bg-green-700 mr-2"
  >
    Completed Orders
  </button>
  <button
    onClick={() => navigate('/cancel-order')}
    className="w-1/2 bg-red-500 text-white py-2 rounded hover:bg-red-700 ml-2"
  >
    Cancel Order
  </button>
</div>