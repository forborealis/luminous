import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Hero } from '../../sections/client';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to access this page');
          navigate('/login');
        }
      } catch (error) {
        toast.error('Please log in to access this page');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

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

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success('Product added to cart');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      partialVisibilityGutter: 40
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      partialVisibilityGutter: 30
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      partialVisibilityGutter: 30
    }
  };

  return (
    <div>
      <Hero />
      <section className="container mx-auto p-4 font-montserrat">
        <h1 className="text-3xl font-semibold mb-6 text-coral-red text-center">Latest Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-md p-4 shadow-md">
              <Carousel
                additionalTransfrom={0}
                arrows
                autoPlaySpeed={3000}
                centerMode={false}
                className=""
                containerClass="container-with-dots"
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite
                itemClass=""
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={responsive}
                showDots={true}
                sliderClass=""
                slidesToSlide={1}
                swipeable
              >
                {product.images && product.images.map((image, index) => (
                  <img key={index} src={image} alt={product.name} className="w-full h-96 object-contain" />
                ))}
              </Carousel>
              <div className="px-4 pb-4">
                <h2 className="text-lg  mb-2 text-gray">{product.name}</h2>
                <p className="text-lg font-bold text-gray-900 mb-4">₱{product.price.toFixed(2)}</p>
                <button className="bg-dark-pink text-white py-2 px-4 w-full md:w-1/2 rounded-full hover:bg-coral-red transition duration-300">
            Add to Cart
          </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Shop;