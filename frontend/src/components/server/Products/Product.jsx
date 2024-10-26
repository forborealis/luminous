import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '/redux/actions/productActions'; // Adjust path
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { products, loading } = useSelector((state) => state.products);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Initialize image index tracking for each product
  useEffect(() => {
    if (products.length > 0) {
      const initialIndexes = {};
      products.forEach((product) => {
        initialIndexes[product._id] = 0;
      });
      setCurrentImageIndex(initialIndexes);
    }
  }, [products]);

  const handleCreateProduct = () => {
    navigate('/admin/products/create');
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to move this product to trash?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleViewTrash = () => {
    navigate('/admin/products/delete');
  };

  const handleNextImage = (productId, images) => {
    setCurrentImageIndex((prevIndexes) => ({
      ...prevIndexes,
      [productId]: (prevIndexes[productId] + 1) % images.length,
    }));
  };

  const handlePreviousImage = (productId, images) => {
    setCurrentImageIndex((prevIndexes) => ({
      ...prevIndexes,
      [productId]: (prevIndexes[productId] - 1 + images.length) % images.length,
    }));
  };

  const columns = [
    {
      name: 'Images', 
      selector: row => (
        <div className="flex items-center space-x-2">
          {/* Disable previous button if only 1 image */}
          <button 
            onClick={() => handlePreviousImage(row._id, row.images)} 
            disabled={row.images.length <= 1}
            className={`text-xl ${row.images.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &#9664; {/* Left arrow */}
          </button>
          <img 
            src={row.images[currentImageIndex[row._id]]} 
            alt={row.name} 
            className="w-16 h-16 object-cover rounded-md"
          />
          {/* Disable next button if only 1 image */}
          <button 
            onClick={() => handleNextImage(row._id, row.images)} 
            disabled={row.images.length <= 1}
            className={`text-xl ${row.images.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &#9654; {/* Right arrow */}
          </button>
        </div>
      )
    }, // Updated Image column with arrows and disabled buttons for single image
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true }, 
    { name: 'Category', selector: row => row.category, sortable: true },    
    { name: 'Stock', selector: row => row.stock, sortable: true },          
    { name: 'Price', selector: row => `$${row.price}`, sortable: true },
    { name: 'Actions', cell: row => (
      <div className="space-x-2">
        <button 
          onClick={() => handleEditProduct(row._id)} 
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-300"
        >
          Edit
        </button>
        <button 
          onClick={() => handleDeleteProduct(row._id)} 
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300"
        >
          Delete
        </button>
      </div>
    )}
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="space-x-4">
          <button 
            onClick={handleCreateProduct} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
          >
            Create Product
          </button>
          <button 
            onClick={handleViewTrash} 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-300"
          >
            View Trash
          </button>
        </div>
      </div>
      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <DataTable 
            columns={columns} 
            data={products} 
            pagination 
            highlightOnHover 
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default Product;
