import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";

const ItemDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/products/${productId}`);
        setProduct(response.data.product); // Ensure this matches the response structure
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 font-montserrat mt-12"> {/* Added mt-12 for margin-top */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <div className="border border-gray-300 p-4 shadow-lg rounded-lg">
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
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8 mt-8 md:mt-16"> 
          <h2 className="text-2xl font-semibold mb-2 text-gray">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{product.category}</p>
          <p className="text-base text-gray-600 mb-4">Description: {product.description}</p>
          <p className="text-xl font-bold text-gray-600 mb-4">₱{product.price.toFixed(2)}</p>
          <button className="bg-dark-pink text-white py-2 px-4 w-full md:w-1/3 rounded-full hover:bg-coral-red transition duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;