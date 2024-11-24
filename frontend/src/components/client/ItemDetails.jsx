import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { CircularProgress, Typography, Box, Rating, Avatar, Grid, Modal, IconButton } from "@mui/material";
import wordfilter from "wordfilter"; // Import wordfilter
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
  const [openModal, setOpenModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleOpenModal = (images, index) => {
    setCurrentImage(images);
    setCurrentImageIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentImage(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentImage.length) % currentImage.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentImage.length);
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
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-4">{product.category}</p>
          <p className="text-base text-gray-600 mb-4">Description: {product.description}</p>
          <p className="text-xl font-bold text-gray-600 mb-4">₱{product.price.toFixed(2)}</p>
        </div>
      </div>

      <Typography variant="h6" sx={{ mt: 4, fontFamily: 'Montserrat' }}>
        Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography sx={{ fontFamily: 'Montserrat' }}>No reviews yet.</Typography>
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
                fontFamily: 'Montserrat',
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar alt={review.userId.name} src={review.userId.avatar?.url || ''} />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>{review.userId.name}</Typography>
                  <Rating value={review.rating} readOnly precision={0.5} />
                  <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Montserrat' }}>
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
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleOpenModal(review.images, index)}
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'transparent', // Set background to transparent
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton onClick={handlePrevImage} disabled={!currentImage || currentImage.length <= 1}>
              <ArrowBackIosIcon />
            </IconButton>
            <img
              src={currentImage ? currentImage[currentImageIndex] : ''}
              alt="Review"
              style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain' }}
            />
            <IconButton onClick={handleNextImage} disabled={!currentImage || currentImage.length <= 1}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ItemDetails;