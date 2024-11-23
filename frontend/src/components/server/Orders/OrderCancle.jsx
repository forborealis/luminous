import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { Box, Button } from '@mui/material';

const OrderCancel = () => {
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch all canceled orders
  const fetchCanceledOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Filter canceled orders
      const canceled = response.data.orders.filter((order) => order.status === 'Cancelled');
      setCanceledOrders(canceled);
    } catch (error) {
      console.error('Error fetching canceled orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  useEffect(() => {
    fetchCanceledOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Prepare flattened data for the main table
  const flattenedOrders = canceledOrders.map((order) => ({
    orderId: order._id,
    userName: order.user?.name || 'Unknown',
    productName: order.items[0]?.product?.name || 'Unknown',
    productImage: order.items[0]?.product?.images?.[0] || '',
    quantity: order.items[0]?.quantity || 0,
    price: order.items[0]?.product?.price || 0,
    shippingFee: 50,
    subtotal: (order.items[0]?.product?.price || 0) * (order.items[0]?.quantity || 0),
    total: (order.items[0]?.product?.price || 0) * (order.items[0]?.quantity || 0) + 50,
    status: order.status,
    additionalProducts: order.items.slice(1), // Store additional products
  }));

  // MUI DataTable columns
  const columns = [
    {
      name: 'userName',
      label: 'Name',
    },
    {
      name: 'productImage',
      label: 'Image',
      options: {
        customBodyRender: (value) =>
          value ? (
            <img
              src={value}
              alt="Product"
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          ) : (
            'No Image'
          ),
      },
    },
    {
      name: 'productName',
      label: 'Product Name',
    },
    {
      name: 'quantity',
      label: 'Quantity',
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        customBodyRender: (value) => `₱${value.toFixed(2)}`,
      },
    },
    {
        name: 'shippingFee',
        label: 'Shipping Fee',
        options: {
          customBodyRender: (value) => `₱${value.toFixed(2)}`,
        },
      },
    {
      name: 'subtotal',
      label: 'Subtotal',
      options: {
        customBodyRender: (value) => `₱${value.toFixed(2)}`,
      },
    },
    {
      name: 'total',
      label: 'Total',
      options: {
        customBodyRender: (value) => `₱${value.toFixed(2)}`,
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value) => <span>{value}</span>, // Display status as text only
      },
    },
    {
      name: 'expand',
      label: '',
      options: {
        customBodyRender: (_, tableMeta) => {
          const { rowIndex } = tableMeta;
          const { orderId } = flattenedOrders[rowIndex];
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => toggleRowExpansion(orderId)}
            >
              {expandedRows[orderId] ? 'Collapse' : 'Expand'}
            </Button>
          );
        },
      },
    },
  ];

  const options = {
    filter: false,
    selectableRows: 'none',
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    download: true,
    print: false,
    search: true,
    responsive: 'standard',
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const { rowIndex } = rowMeta;
      const order = flattenedOrders[rowIndex];
      if (!expandedRows[order.orderId]) return null;

      return (
        <Box
          sx={{
            display: 'table',
            width: '100%',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            marginTop: '10px',
          }}
        >
          {/* Table Header */}
          <Box
            sx={{
              display: 'table-row',
              fontWeight: 'bold',
              backgroundColor: '#e0e0e0',
              padding: '5px',
            }}
          >
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Name</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Image</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Product Name</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Quantity</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Price</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Shipping Fee</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Subtotal</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Total</Box>
          </Box>

          {/* Table Rows */}
          {order.additionalProducts.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'table-row',
                borderBottom: '1px solid #ddd',
              }}
            >
              <Box sx={{ display: 'table-cell', padding: '10px' }}>{order.userName}</Box>
              <Box sx={{ display: 'table-cell', padding: '10px', textAlign: 'center' }}>
                <img
                  src={item.product?.images?.[0] || ''}
                  alt={item.product?.name || 'No Image'}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </Box>
              <Box sx={{ display: 'table-cell', padding: '10px' }}>
                {item.product?.name || 'Unknown'}
              </Box>
              <Box sx={{ display: 'table-cell', padding: '10px' }}>{item.quantity}</Box>
              <Box sx={{ display: 'table-cell', padding: '10px' }}>
                ₱{item.product?.price.toFixed(2) || 0}
              </Box>
              <Box sx={{ display: 'table-cell', padding: '10px' }}>
                ₱{(item.product?.price * item.quantity).toFixed(2)}
              </Box>
              <Box sx={{ display: 'table-cell', padding: '10px' }}>₱50.00</Box>
              <Box sx={{ display: 'table-cell', padding: '10px' }}>
                ₱{(item.product?.price * item.quantity + 50).toFixed(2)}
              </Box>
            </Box>
          ))}
        </Box>
      );
    },
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => navigate('/admin/Order')}>
        Back
      </Button>
      <MUIDataTable
        title={'Cancelled Orders'}
        data={flattenedOrders}
        columns={columns}
        options={options}
      />
    </Box>
  );
};

export default OrderCancel;
