import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductDelete = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const navigate = useNavigate(); // Initialize navigate for back button

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const fetchDeletedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/products/deleted');
      setDeletedProducts(response.data.products || []); // Ensure fallback to empty array
    } catch (error) {
      console.error("Error fetching deleted products:", error);
      alert("Failed to load deleted products.");
    }
  };

  const handleRestore = async () => {
    try {
      await Promise.all(
        selectedProductIds.map(id => axios.put(`http://localhost:5000/api/v1/products/${id}/restore`))
      );
      alert('Selected products restored.');
      fetchDeletedProducts(); // Refresh after restore
      setSelectedProductIds([]); // Clear selection
    } catch (error) {
      console.error("Error restoring products:", error);
      alert('Failed to restore selected products.');
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await Promise.all(
        selectedProductIds.map(id => axios.delete(`http://localhost:5000/api/v1/products/${id}`))
      );
      alert('Selected products permanently deleted.');
      fetchDeletedProducts(); // Refresh after permanent delete
      setSelectedProductIds([]); // Clear selection
    } catch (error) {
      console.error("Error permanently deleting products:", error);
      alert('Failed to permanently delete selected products.');
    }
  };

  const columns = [
    { name: 'name', label: 'Product Name' },
    { name: 'description', label: 'Description' },
    { name: 'price', label: 'Price' },
    { name: 'category', label: 'Category' },
    { name: 'stock', label: 'Stock' },
    {
      name: 'images',
      label: 'Images',
      options: {
        customBodyRender: (value) => (
          <Box>
            {value.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Product"
                style={{ width: 50, height: 50, marginRight: 5 }}
              />
            ))}
          </Box>
        ),
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      const selectedIds = allRowsSelected.map(row => deletedProducts[row.dataIndex]?._id).filter(id => id);
      setSelectedProductIds(selectedIds);
    },
  };

  return (
    <Box>
      {/* Button group with Back, Restore, and Permanent Delete */}
      <Box display="flex" gap={2} mb={2}>
        <Button variant="outlined" onClick={() => navigate('/admin/products')}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleRestore} disabled={selectedProductIds.length === 0}>
          Restore
        </Button>
        <Button variant="contained" color="error" onClick={handlePermanentDelete} disabled={selectedProductIds.length === 0}>
          Permanently Delete
        </Button>
      </Box>

      {/* Deleted Products Table */}
      <MUIDataTable title="Trash Bin" data={deletedProducts} columns={columns} options={options} />
    </Box>
  );
};

export default ProductDelete;
