import React, { useState, useEffect } from 'react';
import Hero from '../../sections/client/Hero';
import Footer from '../../sections/client/Footer';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/products'); // Update this URL if needed
        setProducts(Array.isArray(response.data.products) ? response.data.products.slice(-4) : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className="xl:padding-l wide:padding-r padding-b">
        <Hero />
      </section>
      <section className="container mx-auto p-4 font-montserrat"> {/* Added font-montserrat class */}
        <h1 className="text-3xl font-semibold mb-6 text-coral-red text-center">Latest Releases</h1> {/* Updated to text-6xl */}
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
                responsive={{
                  desktop: {
                    breakpoint: {
                      max: 3000,
                      min: 1024
                    },
                    items: 1,
                    partialVisibilityGutter: 40
                  },
                  mobile: {
                    breakpoint: {
                      max: 464,
                      min: 0
                    },
                    items: 1,
                    partialVisibilityGutter: 30
                  },
                  tablet: {
                    breakpoint: {
                      max: 1024,
                      min: 464
                    },
                    items: 1,
                    partialVisibilityGutter: 30
                  }
                }}
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
                <h2 className="text-lg mb-2 text-coral-red">{product.name}</h2>
                <p className="text-sm text-gray-600 mb-3 truncate">{product.description}</p>
                <p className="text-lg font-bold text-gray-900 mb-4">₱{product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;