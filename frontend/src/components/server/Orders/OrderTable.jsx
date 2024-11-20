// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import MUIDataTable from 'mui-datatables';
// import { Select, MenuItem, Box } from '@mui/material';
// import { toast } from 'react-toastify';

// const OrderTable = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/v1/orders', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setOrders(response.data.orders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (orderId, newStatus, productName) => {
//     try {
//       await axios.put(
//         'http://localhost:5000/api/v1/orders/status',
//         { orderId, status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }
//       );

//       // Notify user based on the new status
//       let emailMessage = '';
//       switch (newStatus) {
//         case 'To Ship':
//           emailMessage = `${productName} is to ship.`;
//           break;
//         case 'Shipped':
//           emailMessage = `${productName} has been shipped.`;
//           break;
//         case 'Completed':
//           emailMessage = `${productName} has been successfully delivered.`;
//           break;
//         default:
//           emailMessage = '';
//       }

//       toast.success(`Order status updated to ${newStatus}`);
//       toast.info(emailMessage);

//       fetchOrders(); // Refresh the table
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       toast.error('Failed to update order status');
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   const columns = [
//     {
//       name: 'user',
//       label: 'User Name',
//       options: {
//         customBodyRender: (value) => value?.name || 'Unknown',
//       },
//     },
//     {
//       name: 'items',
//       label: 'Image',
//       options: {
//         customBodyRender: (value) =>
//           value.length > 0 ? (
//             <img
//               src={value[0]?.product?.images[0]}
//               alt={value[0]?.product?.name}
//               style={{ width: '50px', height: '50px', objectFit: 'cover' }}
//             />
//           ) : (
//             'No Image'
//           ),
//       },
//     },
//     {
//       name: 'items',
//       label: 'Product Name',
//       options: {
//         customBodyRender: (value) =>
//           value.length > 0 ? value[0]?.product?.name : 'Unknown',
//       },
//     },
//     {
//       name: 'items',
//       label: 'Quantity',
//       options: {
//         customBodyRender: (value) =>
//           value.reduce((total, item) => total + item.quantity, 0),
//       },
//     },
//     {
//       name: 'items',
//       label: 'Price',
//       options: {
//         customBodyRender: (value) =>
//           value.length > 0 ? `₱${value[0]?.product?.price.toFixed(2)}` : '₱0.00',
//       },
//     },
//     {
//       name: 'subtotal',
//       label: 'Subtotal',
//       options: {
//         customBodyRender: (_, tableMeta) => {
//           const orderItems = orders[tableMeta.rowIndex].items;
//           const subtotal = orderItems.reduce(
//             (total, item) => total + item.product.price * item.quantity,
//             0
//           );
//           return `₱${subtotal.toFixed(2)}`;
//         },
//       },
//     },
//     {
//       name: 'shippingFee',
//       label: 'Shipping Fee',
//       options: {
//         customBodyRender: () => '₱50.00',
//       },
//     },
//     {
//       name: 'total',
//       label: 'Total',
//       options: {
//         customBodyRender: (_, tableMeta) => {
//           const orderItems = orders[tableMeta.rowIndex].items;
//           const subtotal = orderItems.reduce(
//             (total, item) => total + item.product.price * item.quantity,
//             0
//           );
//           return `₱${(subtotal + 50).toFixed(2)}`;
//         },
//       },
//     },
//     {
//       name: 'status',
//       label: 'Status',
//       options: {
//         customBodyRender: (value, tableMeta) => {
//           const orderId = orders[tableMeta.rowIndex]._id;
//           const productName =
//             orders[tableMeta.rowIndex].items[0]?.product?.name || 'Product';
//           return (
//             <Select
//               value={value}
//               onChange={(e) =>
//                 handleStatusChange(orderId, e.target.value, productName)
//               }
//               fullWidth
//             >
//               <MenuItem value="Order Placed">Order Placed</MenuItem>
//               <MenuItem value="To Ship">To Ship</MenuItem>
//               <MenuItem value="Shipped">Shipped</MenuItem>
//               <MenuItem value="Completed">Completed</MenuItem>
//             </Select>
//           );
//         },
//       },
//     },
//   ];

//   const options = {
//     filter: false,
//     selectableRows: 'none',
//     rowsPerPage: 10,
//     rowsPerPageOptions: [10, 20, 50],
//     download: true,
//     print: false,
//     search: true,
//     responsive: 'standard',
//   };

//   return (
//     <Box>
//       <MUIDataTable
//         title={'Order Management'}
//         data={orders}
//         columns={columns}
//         options={options}
//       />
//     </Box>
//   );
// };

// export default OrderTable;
