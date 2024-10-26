import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProduct = () => {
  const { id } = useParams(); // Get the product ID from URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Lip', // Default category
  });
  const [images, setImages] = useState([]); // New images to be uploaded
  const [existingImages, setExistingImages] = useState([]); // Existing images from DB
  const [previewImages, setPreviewImages] = useState([]); // Previews for new uploads
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing product details to update
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/products/${id}`);
        const product = response.data.product;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
        });

        setExistingImages(product.images); // Existing images from database
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/products'); // Redirect to the products page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if total number of images (existing + new) exceeds 4
    if (files.length + existingImages.length > 4) {
      setErrorMessage('You can only upload a total of 4 images.');
      setImages([]);
      setPreviewImages([]);
      return;
    }

    setErrorMessage('');
    setImages(files);

    // Preview the new images
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if total images exceed 4
    if (images.length + existingImages.length > 4) {
      setErrorMessage('You can only upload a total of 4 images.');
      return;
    }

    setIsSubmitting(true);

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('category', formData.category);

    // Append new images for upload
    images.forEach(image => productData.append('images', image));

    try {
      await axios.put(`http://localhost:5000/api/v1/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Product updated successfully');
      navigate('/admin/products'); // Redirect to product list after successful update
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Product Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="Lip">Lip</option>
            <option value="Blush">Blush</option>
            <option value="Foundation">Foundation</option>
            <option value="Eyeshadow">Eyeshadow</option>
            <option value="Eyebrow">Eyebrow</option>
            <option value="Powder">Powder</option>
          </select>
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Images (Max 4)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Existing Images */}
        <div>
          <h4 className="text-md font-semibold mb-2">Existing Images</h4>
          <div className="flex gap-4">
            {existingImages.map((image, index) => (
              <img key={index} src={image} alt="Product" className="w-24 h-24 rounded-md" />
            ))}
          </div>
        </div>

        {/* Preview New Images */}
        {previewImages.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2">Preview New Images</h4>
            <div className="flex gap-4">
              {previewImages.map((image, index) => (
                <img key={index} src={image} alt="Preview" className="w-24 h-24 rounded-md" />
              ))}
            </div>
          </div>
        )}

        {errorMessage && <div className="text-red-600">{errorMessage}</div>}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-200"
            disabled={isSubmitting}
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition duration-200"
          >
            Back to Products
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
