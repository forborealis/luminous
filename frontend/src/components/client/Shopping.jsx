import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from '@mui/icons-material'; // MUI Shopping Cart icon
import { useNavigate, useLocation } from 'react-router-dom';
import Slider from 'rc-slider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'rc-slider/assets/index.css';
import { CircularProgress, Typography, Box, Rating } from '@mui/material'; // Import Rating here

const Shopping = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Adjust the range as needed
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null); // State for selected rating
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Include the filterStock parameter in the API call
        const response = await axios.get('http://localhost:5000/api/v1/products?filterStock=true');
        const products = Array.isArray(response.data.products) ? response.data.products : [];
        setProducts(products);
        setFilteredProducts(products);

        // Extract unique categories from products
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        setCategories(uniqueCategories);

        // Add a delay of 1 second before setting loading to false
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    const filtered = products.filter(product => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesRating = selectedRating === null || (selectedRating === 1 ? product.averageRating >= 0.5 && product.averageRating <= 1.5 : product.averageRating >= selectedRating && product.averageRating < selectedRating + 1);
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.price.toString().includes(searchQuery);
      return matchesPrice && matchesCategory && matchesRating && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [priceRange, products, selectedCategories, selectedRating, location.search]);

  const handleImageClick = (productId) => {
    navigate(`/item-details/${productId}`);
  };

  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMinPrice(value);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMaxPrice(value);
    setPriceRange([priceRange[0], value]);
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/cart',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(category)
        ? prevSelectedCategories.filter((c) => c !== category)
        : [...prevSelectedCategories, category]
    );
  };

  const getCategoryCount = (category) => {
    return products.filter(product => product.category === category).length;
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const getRatingCount = (rating) => {
    return products.filter(product => rating === 1 ? product.averageRating >= 0.5 && product.averageRating <= 1.5 : product.averageRating >= rating && product.averageRating < rating + 1).length;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 flex font-montserrat">
      <div className="w-1/4 p-4">
        <h2 className="text-lg font-semibold mb-4">Price Range</h2>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="border p-2 rounded-md w-1/3"
              placeholder="Min Price"
            />
            <div className="flex-grow h-px bg-gray-400 mx-2"></div>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="border p-2 rounded-md w-1/3"
              placeholder="Max Price"
            />
          </div>
          <div className="w-3/4 mx-auto">
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              defaultValue={priceRange}
              value={priceRange}
              onChange={setPriceRange}
              className="mb-4"
              trackStyle={{ backgroundColor: '#3A4F7A', height: 8 }}
              handleStyle={{
                borderColor: '#3A4F7A',
                height: 20,
                width: 20,
                marginTop: -6,
                backgroundColor: '#fff',
              }}
              railStyle={{ backgroundColor: '#e0e0e0', height: 8 }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2 text-3A4F7A">
            <span>₱{priceRange[0]}</span>
            <span>₱{priceRange[1]}</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        <div className="mb-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2 h-4 w-4 text-3A4F7A border-gray-300 rounded focus:ring-3A4F7A"
              />
              <label htmlFor={category} className="ml-2 text-sm text-gray-700">
                {category} ({getCategoryCount(category)})
              </label>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-4">By Rating</h2>
        <div className="mb-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-2 cursor-pointer" onClick={() => handleRatingChange(rating)}>
              <Rating value={rating} readOnly precision={0.5} size="small" />
              <span className="ml-2 text-sm text-gray-700">({getRatingCount(rating)})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-3/4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border rounded-md p-4 shadow-md">
              <div className="cursor-pointer" onClick={() => handleImageClick(product._id)}>
                <img
                  src={product.images && product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'fallback-image-url'; // Optional: Fallback image
                  }}
                />
              </div>
              <div className="px-4 pb-4">
                {/* Product Name */}
                <h2 className="text-lg font-semibold mb-2 text-coral-red">{product.name}</h2>

                {/* Average Rating */}
                <div className="mb-3 flex items-center">
                  <Rating
                    value={product.averageRating || 0} // Use product.averageRating, default to 0
                    readOnly
                    precision={0.5} // Ensure half-star ratings are possible
                    size="small"
                  />
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.totalReviews || 0}) {/* Total reviews count */}
                  </span>
                </div>

                {/* Product Description */}
                <p className="text-sm text-gray-600 mb-3 truncate">{product.description}</p>

                {/* Product Price */}
                <p className="text-lg font-bold text-gray-900 mb-4">₱{product.price.toFixed(2)}</p>

                {/* Add to Cart Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleAddToCart(product)}
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
    </div>
  );
};

export default Shopping;