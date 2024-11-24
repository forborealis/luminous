import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Rating,
  CircularProgress,
  Grid,
  Alert,
  Container,
} from '@mui/material';
import { toast } from 'react-toastify';

const Review = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      console.log(`Fetching product with ID: ${productId}`);
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/products/${productId}`);
        console.log('Product fetch successful:', response.data.product);
        setProduct(response.data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Submit review form
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('reviewText', data.reviewText);
      formData.append('rating', data.rating);
  
      if (data.images && data.images.length > 0) {
        for (const file of data.images) {
          formData.append('images', file);
        }
      }
  
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/v1/reviews', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Review submitted successfully:', response.data);
      toast.success('Review submitted successfully');
      navigate('/completed-order');
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Failed to submit review');
    }
  };
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>
          Loading Product Details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, fontFamily: 'Montserrat' }}>
      <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom textAlign="center" fontWeight="semibold" sx={{ fontFamily: 'Montserrat' }}>
          Write a review for {product.name}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="reviewText"
            control={control}
            defaultValue=""
            rules={{ required: 'Review text is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Review Text"
                multiline
                rows={4}
                fullWidth
                error={!!errors.reviewText}
                helperText={errors.reviewText ? errors.reviewText.message : ''}
                sx={{ mb: 3, fontFamily: 'Montserrat', '& .MuiInputBase-root': { fontFamily: 'Montserrat' } }}
              />
            )}
          />

          <Controller
            name="rating"
            control={control}
            defaultValue={0}
            rules={{ required: 'Rating is required' }}
            render={({ field }) => (
              <Box sx={{ mb: 3 }}>
                <Typography component="legend" sx={{ fontFamily: 'Montserrat' }}>Rating</Typography>
                <Rating
                  {...field}
                  precision={0.5}
                  onChange={(event, value) => setValue('rating', value)}
                />
                {errors.rating && (
                  <Typography color="error" sx={{ fontFamily: 'Montserrat' }}>{errors.rating.message}</Typography>
                )}
              </Box>
            )}
          />

          <Box sx={{ mb: 3 }}>
            <Typography component="legend" sx={{ fontFamily: 'Montserrat' }}>Upload Images (Optional)</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              {...register('images')}
              style={{ marginTop: '8px' }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item>
              <Button type="submit" variant="contained" color="primary" sx={{ fontFamily: 'Montserrat' }}>
                Submit Review
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={() => navigate('/completed-order')} sx={{ fontFamily: 'Montserrat' }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Review;