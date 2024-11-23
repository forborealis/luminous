import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button } from '@mui/material';

const CancleOrder = () => {
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();

  const fetchCanceledOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const canceled = response.data.orders.filter((order) => order.status === 'Cancelled');
      setCanceledOrders(canceled);

      const initialImageIndex = {};
      canceled.forEach((order) =>
        order.items.forEach((item) => {
          initialImageIndex[item.product._id] = 0;
        })
      );
      setCurrentImageIndex(initialImageIndex);
    } catch (error) {
      console.error('Error fetching canceled orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (productId, direction) => {
    setCurrentImageIndex((prevState) => {
      const currentIndex = prevState[productId];
      const productImages = canceledOrders
        .flatMap((order) => order.items)
        .find((item) => item.product._id === productId).product.images;

      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % productImages.length
          : (currentIndex - 1 + productImages.length) % productImages.length;

      return { ...prevState, [productId]: newIndex };
    });
  };

  useEffect(() => {
    fetchCanceledOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cancelled Orders</h1>

      {/* Button to navigate back */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button onClick={() => navigate('/order')} variant="contained" color="primary">
          Back to Orders
        </Button>
      </Box>

      {canceledOrders.length === 0 ? (
        <div>No cancelled orders found.</div>
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
            {canceledOrders.map((order) =>
              order.items.map((item) => {
                const subtotal = item.product.price * item.quantity;
                const total = subtotal + 50;
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

export default CancleOrder;
