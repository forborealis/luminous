import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { Box, Button } from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // Track image index for each product
  const navigate = useNavigate(); // Initialize navigation

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Filter orders to exclude Cancelled and Completed
      const filteredOrders = response.data.orders.filter(
        (order) => order.status !== 'Cancelled' && order.status !== 'Completed'
      );

      setOrders(filteredOrders);

      // Initialize the current image index for each product to 0
      const initialImageIndex = {};
      filteredOrders.forEach((order) =>
        order.items.forEach((item) => {
          initialImageIndex[item.product._id] = 0;
        })
      );
      setCurrentImageIndex(initialImageIndex);
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (productId, direction) => {
    setCurrentImageIndex((prevState) => {
      const currentIndex = prevState[productId];
      const productImages = orders
        .flatMap((order) => order.items)
        .find((item) => item.product._id === productId).product.images;

      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % productImages.length
          : (currentIndex - 1 + productImages.length) % productImages.length;

      return { ...prevState, [productId]: newIndex };
    });
  };

  const goToCancleOrders = () => {
    navigate('/cancle-order'); // Navigate to Cancel Orders page
  };
  const goToCompletedOrders = () => {
    navigate('/completed-order'); // Navigate to Completed Orders page
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {/* Buttons to navigate to Cancel Orders and Completed Orders */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button onClick={goToCancleOrders} variant="contained" color="primary">
          Cancel Orders
        </Button>
        <Button onClick={goToCompletedOrders} variant="contained" color="primary" style={{ marginLeft: '10px' }}>
          Completed Orders
        </Button>
      </Box>

      {orders.length === 0 ? (
        <div>You have no orders.</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Subtotal</th>
              <th className="border border-gray-300 px-4 py-2">Shipping Fee</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.items.map((item) => {
                const subtotal = item.product.price * item.quantity;
                const total = subtotal + 50; // Including the shipping fee
                const productImages = item.product.images;
                const currentIndex = currentImageIndex[item.product._id] || 0;

                return (
                  <tr key={item.product._id}>
                    <td className="border border-gray-300 px-4 py-2">
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
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{item.product.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">₱{item.product.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">₱{subtotal.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">₱50.00</td>
                    <td className="border border-gray-300 px-4 py-2">₱{total.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
