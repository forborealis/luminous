import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AvatarEditorComponent from './AvatarEditor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const avatarEditorRef = useRef(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    name: Yup.string().required('Name is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const updatedAvatar = avatarEditorRef.current.getCroppedImage();

    const formData = {
      ...values,
      avatar: updatedAvatar
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'; 
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const headers = {
        Authorization: `Bearer ${token}`
      };

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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 font-palanquin">Edit Profile</h2>
        <Formik
          initialValues={{
            username: '',
            email: '',
            name: '',
            contactNumber: '',
            address: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setValues }) => {
            useEffect(() => {
              const fetchUserData = async () => {
                try {
                  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'; 
                  const token = localStorage.getItem('token');
                  
                  if (!token) {
                    throw new Error('No token found');
                  }

                  const headers = {
                    Authorization: `Bearer ${token}`
                  };

                  const response = await axios.get(`${apiUrl}/user`, { headers });

                  if (response.data.success) {
                    const { username, email, name, contactNumber, address, avatar } = response.data.user;
                    setAvatar(avatar.url);
                    setValues({ username, email, name, contactNumber, address });
                  } else {
                    setError(response.data.message);
                  }
                } catch (error) {
                  console.error('Error fetching user data:', error);
                  setError('An error occurred. Please try again.');
                }
              };

              fetchUserData();
            }, [setValues]);

            return (
              <Form>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="username">
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="w-full px-3 py-2 border rounded font-montserrat"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                </div>
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
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="name">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border rounded font-montserrat"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="contactNumber">
                    Contact Number
                  </label>
                  <Field
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    className="w-full px-3 py-2 border rounded font-montserrat"
                  />
                  <ErrorMessage name="contactNumber" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="address">
                    Address
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border rounded font-montserrat"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="avatar">
                    Upload Avatar
                  </label>
                  {avatar && (
                    <div className="mb-4">
                      <img src={avatar} alt="Current Avatar" className="w-24 h-24 rounded-full mx-auto" />
                    </div>
                  )}
                  <AvatarEditorComponent ref={avatarEditorRef} initialImage={avatar} />
                </div>
                {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-coral-red text-white py-2 rounded hover:bg-coral-red-dark font-montserrat"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfile;