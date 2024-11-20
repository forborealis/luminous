import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [cartDetails, setCartDetails] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
  });
  const shippingFee = 50;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart details from localStorage
    const cart = JSON.parse(localStorage.getItem('checkoutDetails')) || [];
    setCartDetails(cart);

    // Correctly calculate subtotal by considering the quantity
    if (cart.length > 0) {
      const total = cart.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setSubtotal(total);
    }

    // Fetch user info from API
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserInfo(response.data.user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleCancel = () => {
    localStorage.removeItem('checkoutDetails'); // Clear checkout details
    navigate('/cart'); // Navigate back to cart
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/checkout',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Purchase completed!');
      navigate('/orders'); // Navigate to the orders page
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to complete purchase');
    }
  };

  return (
    <div className="container mx-auto p-8 font-montserrat">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="flex flex-wrap -mx-4">
        {/* Left Side - User Information */}
        <div className="w-full lg:w-2/3 px-4">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  value={userInfo.name}
                  readOnly
                  className="border p-2 rounded-md w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  readOnly
                  className="border p-2 rounded-md w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={userInfo.contactNumber}
                  readOnly
                  className="border p-2 rounded-md w-full bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Address</label>
                <textarea
                  value={userInfo.address}
                  readOnly
                  className="border p-2 rounded-md w-full bg-gray-100"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Cart Details */}
        <div className="w-full lg:w-1/3 px-4">
          <div className="bg-white shadow-md rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            <div className="space-y-4">
              {cartDetails.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-medium text-gray-800">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Price: ₱{item.product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-800 font-medium">
                    ₱{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 space-y-2">
              <p className="flex justify-between text-gray-600">
                <span>Shipping Fee:</span> <span>₱{shippingFee.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Subtotal:</span> <span>₱{subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-gray-900 font-bold">
                <span>Total:</span>
                <span>₱{(subtotal + shippingFee).toFixed(2)}</span>
              </p>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
