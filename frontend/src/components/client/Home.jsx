import React, { useState, useEffect } from 'react';
import Hero from '../../sections/client/Hero';
import Footer from '../../sections/client/Footer';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { ClipLoader } from 'react-spinners';
import { CircularProgress, Typography, Box } from '@mui/material';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get(`http://localhost:5000/api/v1/products/infinite-scroll?page=${page}&limit=8`); 
      const newProducts = response.data.products;
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      setHasMore(newProducts.length === 8); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1) {
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div>
      <section className="xl:padding-l wide:padding-r padding-b">
        <Hero />
      </section>
      <section className="container mx-auto p-4 font-montserrat">
        <h1 className="text-3xl font-semibold mb-6 text-coral-red text-center">Latest Releases</h1>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center items-center my-4" key="loader">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          }
        >
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
                    <img key={`${product._id}-${index}`} src={image} alt={product.name} className="w-full h-96 object-contain" />
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
        </InfiniteScroll>
      </section>
    </div>
  );
};

export default Home;