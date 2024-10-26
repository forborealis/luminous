import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductDelete = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [deletedProducts, setDeletedProducts] = useState([]);

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const handleBack = () => {
    navigate('/admin/products'); // Redirect to the products page
  };

  // Fetch the products that are soft-deleted (moved to trash)
  const fetchDeletedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/products/deleted');
      setDeletedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching deleted products:', error);
    }
  };

  // Handle restore product
  const handleRestoreProduct = async (id) => {
    if (window.confirm('Are you sure you want to restore this product?')) {
      try {
        await axios.put(`http://localhost:5000/api/v1/products/restore/${id}`);
        alert('Product restored successfully');
        fetchDeletedProducts(); // Refresh the list after restoring
      } catch (error) {
        console.error('Error restoring product:', error);
        alert('Failed to restore product');
      }
    }
  };

  // Handle permanent deletion
  const handlePermanentDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/v1/products/permanent/${id}`);
        alert('Product permanently deleted');
        fetchDeletedProducts(); // Refresh the list after permanent deletion
      } catch (error) {
        console.error('Error permanently deleting product:', error);
        alert('Failed to permanently delete product');
      }
    }
  };

  // Custom Image Slider Component for DataTable
  const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
      <div className="flex items-center space-x-2">
        {/* Disable prev button if only one image */}
        <button 
          onClick={handlePrev} 
          className={`text-sm bg-gray-300 px-2 py-1 rounded ${images.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={images.length <= 1}
        >
          &lt;
        </button>
        <img
          src={images[currentIndex]}
          alt={`Product Image ${currentIndex + 1}`}
          className="w-16 h-16 object-cover rounded-md"
        />
        {/* Disable next button if only one image */}
        <button 
          onClick={handleNext} 
          className={`text-sm bg-gray-300 px-2 py-1 rounded ${images.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={images.length <= 1}
        >
          &gt;
        </button>
      </div>
    );
  };

  // DataTable columns for deleted products
  const columns = [
    {
      name: 'Images',
      selector: row => <ImageSlider images={row.images} />, // Slider for multiple images
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
    },
    {
      name: 'Price',
      selector: row => `$${row.price}`,
    },
    {
      name: 'Category',
      selector: row => row.category,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition duration-200"
            onClick={() => handleRestoreProduct(row._id)}
          >
            Restore
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition duration-200"
            onClick={() => handlePermanentDelete(row._id)}
          >
            Delete Forever
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <h3 className="text-2xl font-bold mb-4">Deleted Products (Trash)</h3>
      
      <DataTable
        columns={columns}
        data={deletedProducts}
        pagination
        highlightOnHover
        noDataComponent="No deleted products."
      />

      <div className="mt-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition duration-200"
          onClick={handleBack}
        >
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default ProductDelete;
