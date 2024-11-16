import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { Button, Collapse, Typography, Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [imageIndexMap, setImageIndexMap] = useState({}); // Store current image index per product
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/products');
      setProducts(response.data.products);
      setSelectedProductIds([]);
      setImageIndexMap({}); // Reset image indices when fetching new data
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleUpdate = () => {
    if (selectedProductIds.length > 1) {
      alert("Error: Cannot update multiple products.");
    } else if (selectedProductIds.length === 1) {
      navigate(`/admin/products/update/${selectedProductIds[0]}`);
    } else {
      alert('Please select a product to update.');
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedProductIds.map(id => axios.put(`http://localhost:5000/api/v1/products/${id}/soft-delete`))
      );
      alert('Selected products moved to trash.');
      fetchProducts();
    } catch (error) {
      console.error("Error soft deleting products:", error);
      alert('Failed to delete selected products.');
    }
  };

  const handleImageNavigation = (productId, direction) => {
    setImageIndexMap(prev => {
      const currentIndex = prev[productId] || 0;
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      return { ...prev, [productId]: newIndex };
    });
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
        customBodyRender: (value, tableMeta) => {
          const productId = products[tableMeta.rowIndex]._id;
          const imageIndex = imageIndexMap[productId] || 0;

          return (
            <Box display="flex" alignItems="center">
              {/* Previous Button */}
              <IconButton
                onClick={() => handleImageNavigation(productId, 'prev')}
                disabled={imageIndex === 0}
                size="small"
              >
                <ArrowBack />
              </IconButton>

              {/* Current Image */}
              <img
                src={value[imageIndex]}
                alt={`Product Image ${imageIndex + 1}`}
                style={{ width: 50, height: 50, margin: '0 5px' }}
              />

              {/* Next Button */}
              <IconButton
                onClick={() => handleImageNavigation(productId, 'next')}
                disabled={imageIndex === value.length - 1}
                size="small"
              >
                <ArrowForward />
              </IconButton>
            </Box>
          );
        },
      },
    },
    {
      name: 'details',
      label: 'Details',
      options: {
        customBodyRenderLite: (dataIndex) => (
          <Button onClick={() => toggleRow(dataIndex)}>
            {expandedRows[dataIndex] ? 'Collapse' : 'Expand'}
          </Button>
        ),
      },
    },
  ];

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const options = {
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const product = products[rowMeta.dataIndex];
      return (
        <Collapse in={expandedRows[rowMeta.dataIndex]}>
          <Box padding={2}>
            <Typography variant="body1"><strong>Description:</strong> {product.description}</Typography>
            <Typography variant="body2"><strong>Stock:</strong> {product.stock}</Typography>
          </Box>
        </Collapse>
      );
    },
    selectableRows: 'multiple',
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      const selectedIds = allRowsSelected
        .map(row => products[row.dataIndex]?._id)
        .filter(id => id);
      setSelectedProductIds(selectedIds);
    },
    selectToolbarPlacement: 'none',
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/products/create')}>
          Create Product
        </Button>
        <Button variant="contained" color="secondary" onClick={handleUpdate} disabled={selectedProductIds.length === 0}>
          Update Product
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={selectedProductIds.length === 0}>
          Delete
        </Button>
        <Button variant="contained" onClick={() => navigate('/admin/products/trash')}>
          Trash Bin
        </Button>
      </Box>
      <MUIDataTable title="Product List" data={products} columns={columns} options={options} />
    </Box>
  );
};

export default ProductTable;
