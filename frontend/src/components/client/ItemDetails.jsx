import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { CircularProgress, Typography, Box, Rating, Avatar, Grid } from "@mui/material";
import wordfilter from "wordfilter"; // Import wordfilter

// Define your custom bad words
const customBadWords = [
  "putangina",
  "tangina",
  "gago",
  "ulol",
  "pakyu",
  "bobo",
  "tanga",
  "tarantado",
  "leche",
  "hayop",
  "lintik",
  "bwisit",
  "siraulo",
  "sira-ulo",
  "hinayupak",
  "peste",
  "punyeta",
  "yawa",
  "demonyo",
  "shet",
  "syet",
  "gunggong",
  "tangina mo",
  "putang ina mo",
  "putang ina",
  "tangina",
  "tang ina mo",
  "shit",
  "fuck",
  "stupid",
  "motherfucker",
  "fucker",
  "damn",
];

// Add custom bad words to wordfilter
wordfilter.addWords(customBadWords);

const ItemDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sanitize reviews using wordfilter
  const sanitizeReviews = (reviews) => {
    return reviews.map((review) => {
      let sanitizedText = review.reviewText;
      if (wordfilter.blacklisted(sanitizedText)) {
        customBadWords.forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "gi");
          sanitizedText = sanitizedText.replace(regex, "****");
        });
      }
      return { ...review, reviewText: sanitizedText };
    });
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5000/api/v1/products/${productId}`);
        const reviewsResponse = await axios.get(`http://localhost:5000/api/v1/reviews/${productId}`);
        setProduct(productResponse.data.product);

        // Sanitize reviews
        const sanitizedReviews = sanitizeReviews(reviewsResponse.data.reviews);
        setReviews(sanitizedReviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

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
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 font-montserrat mt-12">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <div className="border border-gray-300 p-4 shadow-lg rounded-lg">
            <Carousel
              additionalTransfrom={0}
              arrows
              autoPlaySpeed={3000}
              infinite
              showDots={true}
              responsive={{
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
                tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
                mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
              }}
            >
              {product.images &&
                product.images.map((image, index) => (
                  <img key={index} src={image} alt={product.name} className="w-full h-96 object-contain" />
                ))}
            </Carousel>
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8 mt-8 md:mt-16">
          <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
          <p className="text-sm text-gray-600 mb-4">{product.category}</p>
          <p className="text-base text-gray-600 mb-4">Description: {product.description}</p>
          <p className="text-xl font-bold text-gray-600 mb-4">₱{product.price.toFixed(2)}</p>
        </div>
      </div>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {reviews.map((review) => (
            <Box
              key={review._id}
              sx={{
                mb: 4,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar alt={review.userId.name} src={review.userId.avatar} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6">{review.userId.name}</Typography>
                  <Rating value={review.rating} readOnly precision={0.5} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {review.reviewText}
                  </Typography>
                  {review.images.length > 0 && (
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index}`}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default ItemDetails;
