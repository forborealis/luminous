import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCart(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        'http://localhost:5000/api/v1/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchCart(); // Refresh the cart
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete('http://localhost:5000/api/v1/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        data: { productId },
      });
      fetchCart(); // Refresh the cart
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error(error.response?.data?.message || 'Failed to remove product');
    }
  };

  const handleCheckout = () => {
    localStorage.setItem('checkoutDetails', JSON.stringify(cart)); // Save cart details for checkout
    navigate('/checkout');
  };

  const goToOrders = () => {
    navigate('/order'); // Navigate to Orders page
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontFamily: 'Montserrat' }}>
          Your Cart
        </Typography>
        <Button variant="contained" color="success" onClick={goToOrders} sx={{ fontFamily: 'Montserrat' }}>
          Go to Orders
        </Button>

      </Box>
      {cart.length === 0 ? (
        <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Montserrat' }}>
          Your cart is currently empty.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: 'Montserrat' }}>Image</TableCell>
                  <TableCell sx={{ fontFamily: 'Montserrat' }}>Name</TableCell>
                  <TableCell sx={{ fontFamily: 'Montserrat' }}>Price</TableCell>
                  <TableCell sx={{ fontFamily: 'Montserrat' }}>Quantity</TableCell>
                  <TableCell sx={{ fontFamily: 'Montserrat' }}>Total</TableCell>
                  <TableCell sx={{ fontFamily: 'Montserrat' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.product._id}>
                    <TableCell sx={{ fontFamily: 'Montserrat' }}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Montserrat' }}>{item.product.name}</TableCell>
                    <TableCell sx={{ fontFamily: 'Montserrat' }}>₱{item.product.price.toFixed(2)}</TableCell>
                    <TableCell sx={{ fontFamily: 'Montserrat' }}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ fontFamily: 'Montserrat' }}>{item.quantity}</Typography>
                        <IconButton
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Montserrat' }}>₱{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell sx={{ fontFamily: 'Montserrat' }}>
                      <IconButton onClick={() => removeFromCart(item.product._id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ fontFamily: 'Montserrat' }}>
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;