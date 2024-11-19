import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from '@mui/icons-material'; // MUI Shopping Cart icon
import { useNavigate } from 'react-router-dom';

const Shopping = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/products'); // Update this URL if needed
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleImageClick = (productId) => {
    navigate(`/item-details/${productId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-md p-4 shadow-md">
            <div className="cursor-pointer" onClick={() => handleImageClick(product._id)}>
              <img
                src={product.images && product.images[0]} 
                alt={product.name}
                className="w-full h-40 object-contain mb-4"
                onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url'; }} // Optional: Fallback image
              />
            </div>
            <div className="px-4 pb-4">
              <h2 className="text-lg font-semibold mb-2 text-gray">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-3 truncate">{product.description}</p>
              <p className="text-lg font-bold text-gray-900 mb-4">₱{product.price.toFixed(2)}</p>
              <div className="flex justify-end">
                <button
                  className="text-black-500 hover:text-coral-red transition duration-300"
                  aria-label="Add to Cart"
                >
                  <ShoppingCart fontSize="medium" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shopping;