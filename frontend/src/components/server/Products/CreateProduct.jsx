// CreateProduct.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Validation schema with Yup
const schema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be a positive number'),
  category: yup.string().required('Category is required'),
  stock: yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative'),
});

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageLimitExceeded, setImageLimitExceeded] = useState(false); // New state

  // React Hook Form setup
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Fetch categories on mount
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/products');
        if (response.data.categoryOptions) {
          setCategoryOptions(response.data.categoryOptions);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 4) {
      setImageLimitExceeded(true); // Set state to true if more than 4 images are selected
    } else {
      setImageLimitExceeded(false); // Reset state if 4 or fewer images are selected
      setImages(files);
      // Create image preview URLs
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append form data
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    images.forEach((image) => formData.append('images', image));

    try {
      await axios.post('http://localhost:5000/api/v1/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product created successfully!');
      reset(); // Reset form fields
      setImagePreviews([]);
      setImages([]);
      navigate('/admin/products'); // Redirect to products page
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        maxWidth: 600,
        margin: 'auto',
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Back Button */}
      <Button variant="outlined" onClick={() => navigate('/admin/products')} sx={{ alignSelf: 'flex-start', mb: 2 }}>
        Back
      </Button>

      <Typography variant="h4" gutterBottom>Create New Product</Typography>

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
            <InputLabel>Category</InputLabel>
            <Select {...field} label="Category">
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
            {errors.category && <Typography color="error">{errors.category.message}</Typography>}
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
          />
        )}
      />

      {/* Image Upload */}
      <Button
        variant="contained"
        component="label"
        fullWidth
        color={imageLimitExceeded ? "error" : "primary"} // Change color based on image limit
      >
        {imageLimitExceeded ? "Limit Exceeded (Max 4 Images)" : "Choose Files"}
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
      </Button>

      {/* Image Previews */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {imagePreviews.map((src, index) => (
          <img key={index} src={src} alt={`Preview ${index + 1}`} style={{ width: 100, height: 100, borderRadius: 4 }} />
        ))}
      </Box>

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>Create Product</Button>
    </Box>
  );
};

export default CreateProduct;
