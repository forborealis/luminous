import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Pagination,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';

const CompletedOrder = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCompletedOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/v1/completed-orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCompletedOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (productId, direction) => {
    setCurrentImageIndex((prevState) => {
      const currentIndex = prevState[productId];
      const productImages = completedOrders
        .flatMap((order) => order.items)
        .find((item) => item.product._id === productId)?.product.images;

      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % productImages.length
          : (currentIndex - 1 + productImages.length) % productImages.length;

      return { ...prevState, [productId]: newIndex };
    });
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Flatten orders into individual items
  const flattenedItems = completedOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderStatus: order.status,
      orderId: order._id, // Include orderId for review navigation
    }))
  );

  const paginatedItems = flattenedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <Box mb={2} display="flex" justifyContent="space-between">
        <Button onClick={() => navigate('/order')} variant="contained" color="primary">
          Back to Orders
        </Button>
        <Button onClick={() => navigate('/review')} variant="contained" color="secondary">
          Reviewed Products
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Montserrat' }}></TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Product</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Quantity</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Price</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Subtotal</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Shipping Fee</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Total</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Status</TableCell>
                <TableCell sx={{ fontFamily: 'Montserrat' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => {
                  const subtotal = item.product.price * item.quantity;
                  const total = subtotal + 50; // Including the shipping fee
                  const productImages = item.product.images;
                  const currentIndex = currentImageIndex[item.product._id] || 0;

                  return (
                    <TableRow key={`${item.orderId}-${item.product._id}`}>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>
                        <div className="relative flex flex-col items-center">
                          <img
                            src={productImages[currentIndex]}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover mx-auto"
                          />
                          <div className="flex mt-2 gap-2">
                            <button
                              onClick={() => handleImageChange(item.product._id, 'prev')}
                              disabled={productImages.length <= 1}
                              className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 ${
                                productImages.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              ←
                            </button>
                            <button
                              onClick={() => handleImageChange(item.product._id, 'next')}
                              disabled={productImages.length <= 1}
                              className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 ${
                                productImages.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              →
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>{item.product.name}</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>{item.quantity}</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>₱{item.product.price.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>₱{subtotal.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>₱50.00</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>₱{total.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>{item.orderStatus}</TableCell>
                      <TableCell sx={{ fontFamily: 'Montserrat' }}>
                        <Button
                          onClick={() =>
                            navigate(`/create-review/${item.product._id}?orderId=${item.orderId}`)
                          }
                          variant="outlined"
                          color="primary"
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ fontFamily: 'Montserrat' }}>
                    No completed orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {paginatedItems.length > 0 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(flattenedItems.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
};

export default CompletedOrder;
