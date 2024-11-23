import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import { Select, MenuItem, Box, Button } from '@mui/material';
import { toast } from 'react-toastify';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate


  // Fetch all orders for admin
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/admin/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      const activeOrders = response.data.orders.filter(
        (order) => order.status !== 'Cancelled' && order.status !== 'Completed'
      );
      setOrders(activeOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };
  

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistically update the UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
  
      const response = await axios.put(
        "http://localhost:5000/api/v1/orders/status",
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      toast.success(response.data.notification);
  
      // Refresh orders from the backend for accuracy
      fetchAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update order status";
      toast.error(errorMessage);
      // Revert optimistic update if error occurs
      fetchAllOrders();
    }
  };
  
  
  
  

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Prepare flattened data for the main table
  const flattenedOrders = orders.map((order) => ({
    orderId: order._id,
    userName: order.user?.name || 'Unknown',
    productName: order.items[0]?.product?.name || 'Unknown',
    productImage: order.items[0]?.product?.images?.[0] || '',
    quantity: order.items[0]?.quantity || 0,
    price: order.items[0]?.product?.price || 0,
    subtotal: (order.items[0]?.product?.price || 0) * (order.items[0]?.quantity || 0),
    shippingFee: 50,
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
        customBodyRender: (value, tableMeta) => {
          const { rowIndex } = tableMeta;
          const { orderId } = flattenedOrders[rowIndex];
          return (
            <Select
            value={value}
            onChange={(e) => handleStatusChange(orderId, e.target.value)} // Correctly sending 'newStatus'
            fullWidth
          >
            <MenuItem value="Order Placed">Order Placed</MenuItem>
            <MenuItem value="To Ship">To Ship</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem> {/* New option */}
          </Select>
          
          );
        },
        
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
            <Box sx={{ display: 'table-cell', padding: '10px' }}>User Name</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Image</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Product Name</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Quantity</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Price</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Shipping Fee</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Subtotal</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Total</Box>
            <Box sx={{ display: 'table-cell', padding: '10px' }}>Status</Box>
          </Box>
    
          {/* Table Rows */}
          {order.additionalProducts.map((item, index) => {
            const currentStatus = item?.status || order.status; // Define value
            return (
              <Box
                key={index}
                sx={{
                  display: 'table-row',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <Box sx={{ display: 'table-cell', padding: '10px' }}>
                  {order.userName}
                </Box>
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
                <Box sx={{ display: 'table-cell', padding: '10px' }}>
                  <Select
                    value={currentStatus} // Correctly define value
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)} // Correctly pass orderId
                    fullWidth
                  >
                    <MenuItem value="Order Placed">Order Placed</MenuItem>
                    <MenuItem value="To Ship">To Ship</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </Box>
              </Box>
            );
          })}
        </Box>
      );
    },
  };
  
  
  return (
    <Box>

<Button variant="contained" onClick={() => navigate('/admin/OrderCancle')}>
            Cancled Orders
          </Button>
          <Button variant="contained" onClick={() => navigate('/admin/OrderCompleted')}>
            Completed Orders
          </Button>
      <MUIDataTable
        title={'Order Management'}
        data={flattenedOrders}
        columns={columns}
        options={options}
      />
    </Box>
  );

  
};

export default OrderTable;
