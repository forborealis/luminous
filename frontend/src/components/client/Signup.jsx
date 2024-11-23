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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import signupImage from '../../assets/images/signup-image.jpg'; // Replace with your image path
import { requestFCMToken } from "../../firebase/fcmFunction"; // Import the FCM token function

const Signup = () => {
  const navigate = useNavigate();
  const avatarEditorRef = useRef(null);
  const [error, setError] = useState('');

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Dynamically request a fresh FCM token
      let fcmToken;
      try {
        fcmToken = await requestFCMToken();
      } catch (error) {
        console.error("Error generating FCM token:", error);
        setError("Failed to generate FCM token. Please enable notifications.");
        return;
      }

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
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('firebaseUID', user.uid); // Store Firebase UID

        // Save the FCM token to the backend
        try {
          await axios.post(
            'http://localhost:5000/api/v1/users/save-fcm-token',
            {
              firebaseUID: user.uid,
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

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    username: Yup.string().required('Username is required'),
    name: Yup.string().required('Name is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, username, name, contactNumber, address, password } = values;
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-6xl">
        <div className="w-1/2 hidden md:block">
          <img src={signupImage} alt="Signup" className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
          <Formik
            initialValues={{
              email: '',
              username: '',
              name: '',
              contactNumber: '',
              address: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 border rounded font-montserrat"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4">
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username"
                      className="w-full px-3 py-2 border rounded font-montserrat"
                    />
                    <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4">
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      className="w-full px-3 py-2 border rounded font-montserrat"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4">
                    <Field
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      placeholder="Contact Number"
                      className="w-full px-3 py-2 border rounded font-montserrat"
                    />
                    <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Address"
                      className="w-full px-3 py-2 border rounded font-montserrat"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4">
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="w-full px-3 py-2 border rounded font-montserrat"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-6">
                    <AvatarEditorComponent ref={avatarEditorRef} />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col items-center">
                  {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
                  <button
                    type="submit"
                    className="w-3/4 bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={handleGoogleSignUp}
                    className="w-3/4 bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 font-montserrat flex items-center justify-center"
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Signup;