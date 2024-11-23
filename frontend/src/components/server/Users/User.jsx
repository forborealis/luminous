import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { Button, Box, ThemeProvider } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import theme from './theme'; // Import the theme

const User = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://localhost:5000/api/v1/users/verified', config);
      console.log('Fetched Users:', response.data.users); // Debugging: Log the fetched users
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users.');
    }
  };

  const handleDeactivate = async () => {
    try {
      console.log('Selected Users for Deactivation:', selectedUsers); // Debugging: Log the selected users
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        'http://localhost:5000/api/v1/users/deactivate',
        { userIds: selectedUsers },
        config
      );

      toast.success('Selected users have been deactivated.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deactivating users:', error);
      toast.error('Failed to deactivate users.');
    }
  };

  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        setCellProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
        setCellHeaderProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        setCellProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
        setCellHeaderProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
      },
    },
    {
      name: 'contactNumber',
      label: 'Contact Number',
      options: {
        setCellProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
        setCellHeaderProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
      },
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        setCellProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
        setCellHeaderProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        setCellProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
        setCellHeaderProps: () => ({ style: { fontFamily: 'Montserrat, sans-serif' } }),
      },
    },
  ];

  const options = {
    filter: false,
    selectableRows: 'multiple',
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      const selectedIds = allRowsSelected.map(row => {
        const user = users[row.dataIndex];
        console.log('Selected User:', user); // Debugging: Log the selected user
        return user ? user.firebaseUID : undefined;
      });
      console.log('Selected IDs:', selectedIds); // Debugging: Log the selected IDs
      setSelectedUsers(selectedIds.filter(id => id !== undefined)); // Filter out undefined IDs
    },
    customToolbarSelect: () => null, // Disable the default selection toolbar
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 50],
    download: true,
    print: false,
    search: true,
    responsive: 'standard',
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="container mx-auto p-4">
        <ToastContainer /> {/* Add ToastContainer to display toasts */}
        <Box mb={2} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeactivate}
            disabled={selectedUsers.length === 0}
          >
            Deactivate
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin/users/deactivated')}
          >
            Deactivated Users
          </Button>
        </Box>
        <MUIDataTable
          title={'Verified Users'}
          data={users}
          columns={columns}
          options={options}
        />
      </div>
    </ThemeProvider>
  );
};

export default User;