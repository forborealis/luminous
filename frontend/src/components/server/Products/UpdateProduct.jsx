// UpdateProduct.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

// Validation schema with Yup
const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be a positive number'),
  category: yup.string().required('Category is required'),
  stock: yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative'),
});

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageLimitExceeded, setImageLimitExceeded] = useState(false);

  // React Hook Form setup with Yup validation
  const { handleSubmit, control, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Fetch product and category options on mount
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/products/${id}`);
        const product = response.data.product;

        // Set initial form values
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price);
        setValue('category', product.category);
        setValue('stock', product.stock);
        setCurrentImages(product.images || []); // Load existing images
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('Failed to fetch product data.');
      }
    };

    const fetchCategoryOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/products');
        setCategoryOptions(response.data.categoryOptions || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
    fetchCategoryOptions();
  }, [id, setValue]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setImageLimitExceeded(true);
    } else {
      setImageLimitExceeded(false);
      setImages(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const onSubmit = async (data) => {
    if (imageLimitExceeded) {
      alert('Failed to update product. You cannot upload more than 4 images.');
      return;
    }

    const formData = new FormData();

    // Append text fields to formData
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    images.forEach((image) => formData.append('images', image));

    try {
      await axios.put(`http://localhost:5000/api/v1/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className="font-montserrat"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        width: '40%', // Make the container wider
        margin: 'auto',
        marginTop: 5, // Add margin to bring it lower
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Back Button */}
      <Button
        variant="outlined"
        onClick={() => navigate('/admin/products')}
        sx={{
          alignSelf: 'flex-start',
          mb: 2,
          fontFamily: 'Montserrat, sans-serif',
          backgroundColor: 'light-pink',
          '&:hover': {
            backgroundColor: 'coral-red',
          },
        }}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif' }}>
        Update Product
      </Typography>

      {/* Product Name */}
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Product Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            InputLabelProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
            InputProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
          />
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            InputLabelProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
            InputProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
          />
        )}
      />

      {/* Price */}
      <Controller
        name="price"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Price"
            type="number"
            fullWidth
            error={!!errors.price}
            helperText={errors.price?.message}
            InputLabelProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
            InputProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
          />
        )}
      />

      {/* Category */}
      <Controller
        name="category"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Category</InputLabel>
            <Select
              {...field}
              label="Category"
              sx={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {errors.category && <Typography color="error" sx={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.category.message}</Typography>}
          </FormControl>
        )}
      />

      {/* Stock */}
      <Controller
        name="stock"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Stock"
            type="number"
            fullWidth
            error={!!errors.stock}
            helperText={errors.stock?.message}
            InputLabelProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
            InputProps={{ style: { fontFamily: 'Montserrat, sans-serif' } }}
          />
        )}
      />

      {/* Current Images */}
      <Typography variant="subtitle1" sx={{ mt: 2, fontFamily: 'Montserrat, sans-serif' }}>Current Images</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {currentImages.length > 0 ? (
          currentImages.map((src, index) => (
            <img key={index} src={src} alt={`Current ${index + 1}`} style={{ width: 100, height: 100, borderRadius: 4 }} />
          ))
        ) : (
          <Typography sx={{ fontFamily: 'Montserrat, sans-serif' }}>No current images available.</Typography>
        )}
      </Box>

      {/* Image Upload */}
      <Button
        variant="contained"
        component="label"
        fullWidth
        color={imageLimitExceeded ? "error" : "primary"}
        sx={{
          mt: 2,
          fontFamily: 'Montserrat, sans-serif',
          backgroundColor: 'light-pink',
          '&:hover': {
            backgroundColor: 'coral-red',
          },
        }}
      >
        {imageLimitExceeded ? "Limit Exceeded (Max 4 Images)" : "Choose New Files"}
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
      </Button>

      {/* New Image Previews */}
      <Typography variant="subtitle1" sx={{ mt: 2, fontFamily: 'Montserrat, sans-serif' }}>New Images (if selected)</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {imagePreviews.map((src, index) => (
          <img key={index} src={src} alt={`Preview ${index + 1}`} style={{ width: 100, height: 100, borderRadius: 4 }} />
        ))}
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          fontFamily: 'Montserrat, sans-serif',
          backgroundColor: 'light-pink',
          '&:hover': {
            backgroundColor: 'coral-red',
          },
        }}
      >
        Update Product
      </Button>
    </Box>
  );
};

export default UpdateProduct;