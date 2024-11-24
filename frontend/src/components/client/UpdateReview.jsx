import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Rating,
  Card,
  CardMedia,
  Alert,
} from "@mui/material";

const UpdateReview = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [productImage, setProductImage] = useState(null); // Current product image
  const [previousImages, setPreviousImages] = useState([]); // Previously uploaded images
  const [selectedFiles, setSelectedFiles] = useState([]); // New images upload
  const [imageError, setImageError] = useState(""); // Error for image uploads

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        if (!reviewId) throw new Error("Invalid review ID");

        const response = await axios.get(
          `http://localhost:5000/api/v1/reviews/review/${reviewId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const { review } = response.data;

        if (!review) throw new Error("Review not found");

        setReview(review);
        setProductImage(review.images?.[0] || null);
        setPreviousImages(review.images || []);
        setValue("reviewText", review.reviewText || "");
        setValue("rating", review.rating || 0);
      } catch (error) {
        console.error("Error fetching review:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, setValue]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setImageError("You can only upload a maximum of 4 images.");
      setSelectedFiles([]);
    } else {
      setImageError("");
      setSelectedFiles(files);
    }
  };

  const onSubmit = async (data) => {
    if (selectedFiles.length === 0) {
      setImageError("You must upload at least one new image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("reviewText", data.reviewText);
      formData.append("rating", data.rating);

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await axios.put(`http://localhost:5000/api/v1/reviews/${reviewId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/completed-order");
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold">
        Update Review
      </Typography>
      {productImage && (
        <Card sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
            Current Product Image
          </Typography>
          <CardMedia
            component="img"
            image={productImage}
            alt="Product"
            sx={{ objectFit: "contain", height: 300 }}
          />
        </Card>
      )}
      {previousImages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Previous Images:</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
            {previousImages.map((img, index) => (
              <Card key={index} sx={{ maxWidth: 120 }}>
                <CardMedia
                  component="img"
                  image={img}
                  alt={`Previous image ${index + 1}`}
                  sx={{ objectFit: "contain", height: 120 }}
                />
              </Card>
            ))}
          </Box>
        </Box>
      )}
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Controller
          name="reviewText"
          control={control}
          rules={{ required: "Review text is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={4}
              label="Review Text"
              variant="outlined"
              error={!!errors.reviewText}
              helperText={errors.reviewText?.message}
              sx={{ mb: 3 }}
            />
          )}
        />
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">Rating:</Typography>
              <Rating {...field} precision={0.5} />
            </Box>
          )}
        />
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Upload New Product Images:
          </Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {imageError && <Alert severity="error" sx={{ mt: 1 }}>{imageError}</Alert>}
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            "&:hover": { bgcolor: "primary.dark" },
            p: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Update Review
        </Button>
      </form>
    </Box>
  );
};

export default UpdateReview;
