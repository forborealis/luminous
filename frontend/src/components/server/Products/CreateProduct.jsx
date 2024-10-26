import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '/redux/actions/productActions';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'Lip' });
  const [images, setImages] = useState([]);
  const [formErrors, setFormErrors] = useState({}); // Track form validation errors
  const [imageError, setImageError] = useState(''); // Track image validation error

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Product name is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.price) errors.price = 'Price is required';
    if (images.length === 0) errors.images = 'You must upload at least one image';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop form submission if there are validation errors
    }

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('category', formData.category);
    images.forEach(image => productData.append('images', image));

    dispatch(createProduct(productData)).then(() => navigate('/admin/products'));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 4) {
      setImageError('You can only upload a total of 4 images');
      setImages([]); // Reset images
    } else {
      setImageError(''); // Clear error if less than 4 images
      setImages(selectedFiles);
    }
  };

  const handleBack = () => {
    navigate('/admin/products'); // Navigate back to the products page
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`mt-1 block w-full px-4 py-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
        </div>

        {/* Product Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`mt-1 block w-full px-4 py-2 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
        </div>

        {/* Product Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          <label className="block text-sm font-medium text-gray-700">Upload Images (Max 4)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          {formErrors.images && <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Create Product
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-full px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition duration-200"
          >
            Back to Products
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
