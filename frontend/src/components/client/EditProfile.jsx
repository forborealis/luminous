import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AvatarEditorComponent from './AvatarEditor';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button'; 

const EditProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const avatarEditorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/v1/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile.');
      }
    };

    fetchUserProfile();
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    name: Yup.string().required('Name is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const avatar = avatarEditorRef.current?.getCroppedImage();
      const formData = { ...values, avatar };

      const response = await axios.put('http://localhost:5000/api/v1/user', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        navigate('/profile');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-100 font-montserrat mt-12 mb-12"> {/* Added margin-top and margin-bottom */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg"> {/* Increased max-width */}
        <h2 className="text-2xl font-bold mb-6 font-montserrat text-center">Edit Profile</h2>
        <Formik
          initialValues={{
            email: user.email,
            username: user.username,
            name: user.name,
            contactNumber: user.contactNumber,
            address: user.address,
          }}
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
                  className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
                  disabled={user.firebaseUID ? true : false} // Disable if signed up with Google
                />
                <ErrorMessage name="email" component="div" className="text-red-500 font-montserrat" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="username">
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
                />
                <ErrorMessage name="username" component="div" className="text-red-500 font-montserrat" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="name">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
                />
                <ErrorMessage name="name" component="div" className="text-red-500 font-montserrat" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="contactNumber">
                  Contact Number
                </label>
                <Field
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
                />
                <ErrorMessage name="contactNumber" component="div" className="text-red-500 font-montserrat" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="address">
                  Address
                </label>
                <Field
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 border rounded-lg font-montserrat" // Rounded edges
                />
                <ErrorMessage name="address" component="div" className="text-red-500 font-montserrat" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-montserrat" htmlFor="avatar">
                  Upload Avatar
                </label>
                <AvatarEditorComponent ref={avatarEditorRef} />
              </div>
              {error && <p className="text-red-500 mb-4 font-montserrat">{error}</p>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                className="font-montserrat"
                sx={{
                  backgroundColor: 'coral-red',
                  '&:hover': {
                    backgroundColor: 'coral-red-dark',
                  },
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditProfile;