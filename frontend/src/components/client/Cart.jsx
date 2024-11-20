import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <button
          onClick={goToOrders}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Go to Orders
        </button>
      </div>
      {cart.length === 0 ? (
        <div>Your cart is currently empty.</div>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Image</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{item.product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">₱{item.product.price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
