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
      navigate('/completed-orders');
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Write a Review for {product.name}
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        {product.description}
      </Typography>
      <img
        src={product.images[0]}
        alt={product.name}
        style={{
          width: '100%',
          height: 'auto',
          marginBottom: '16px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      />
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
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="rating"
          control={control}
          defaultValue={0}
          rules={{ required: 'Rating is required' }}
          render={({ field }) => (
            <Box sx={{ mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                {...field}
                precision={0.5}
                onChange={(event, value) => setValue('rating', value)}
              />
              {errors.rating && (
                <Typography color="error">{errors.rating.message}</Typography>
              )}
            </Box>
          )}
        />

        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Upload Images (Optional)</Typography>
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
            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/completed-orders')}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Review;
