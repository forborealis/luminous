// src/components/client/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../firebase/authFunctions';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { auth, googleProvider } from '../../firebase/firebase'; 
import { signInWithPopup } from 'firebase/auth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import GoogleIcon from '@mui/icons-material/Google'; 

const Login = () => {
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
        status: 'Verified', 
      };

      // Check if the user already exists in the backend
      const checkResponse = await axios.post('http://localhost:5000/api/v1/login', formData);

      if (checkResponse.data.success) {
        // User exists, log them in
        localStorage.setItem('token', checkResponse.data.token);
        toast.success('Google Login successful!');
        window.dispatchEvent(new Event('loginStateChange')); 
        navigate(redirect || '/shop'); 
      } else {
        // User does not exist, sign them up
        const signupResponse = await axios.post('http://localhost:5000/api/v1/register', formData);

        if (signupResponse.data.success) {
          localStorage.setItem('token', signupResponse.data.token);
          toast.success('Google Sign-Up successful!');
          window.dispatchEvent(new Event('loginStateChange')); 
          navigate('/edit-profile'); 
        } else {
          setError(signupResponse.data.message);
        }
      }
    } catch (error) {
      console.error('Error during Google Login:', error);
      toast.error('Google Login failed. Please try again.');
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');

    // Hardcoded admin credentials
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    if (values.email === adminEmail && values.password === adminPassword) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
      toast.success('Logged in as admin');
      setSubmitting(false);
      return;
    }

    try {
      const firebaseUser = await loginUser(values.email, values.password);
      if (!firebaseUser?.uid) {
        setError('Unable to authenticate with Firebase.');
        setSubmitting(false);
        return;
      }

      console.log("Firebase UID:", firebaseUser.uid); 

      const response = await axios.post('http://localhost:5000/api/v1/login', {
        firebaseUID: firebaseUser.uid,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        window.dispatchEvent(new Event('loginStateChange')); 
        toast.success('Login successful!');
        navigate(redirect || '/shop');
      } else {
        setError(response.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
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