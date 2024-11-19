import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from '@mui/icons-material'; // MUI Shopping Cart icon
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/products'); // Update this URL if needed
        const products = Array.isArray(response.data.products) ? response.data.products : [];
        setProducts(products);
        setFilteredProducts(products);
        setLoading(false);

        // Extract unique categories from products
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => {
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      return matchesPrice && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [priceRange, products, selectedCategories]);

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

  if (loading) {
    return <div>Loading...</div>;
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
                  onError={(e) => { e.target.onerror = null; e.target.src = 'fallback-image-url'; }} // Optional: Fallback image
                />
              </div>
              <div className="px-4 pb-4">
                <h2 className="text-lg font-semibold mb-2 text-coral-red">{product.name}</h2>
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
    </div>
  );
};

export default Shopping;