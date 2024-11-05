import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export const authenticate = async (username, password, navigate, setError) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.post(`${apiUrl}/login`, { username, password }, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, 
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      window.dispatchEvent(new Event('loginStateChange')); 
      navigate('/shop');
    } else {
      setError(response.data.message);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    setError('Invalid username or password');
  }
};

// Function to get the token from localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Function to log out the user
export const logout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('loginStateChange')); 
  }
  next();
};

export const errMsg = (message = '') => toast.error(message, {
  position: 'bottom-right'
});

export const successMsg = (message = '') => toast.success(message, {
  position: 'bottom-right'
});