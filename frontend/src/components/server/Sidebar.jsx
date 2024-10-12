import React from 'react';
import { Box, List, Divider } from '@mui/material';
import { DashboardOutlined, StorefrontOutlined, PeopleAltOutlined } from '@mui/icons-material';
import Item from './Item';
import headerLogo from '../../assets/images/header-logo.svg'; // Adjust the path as necessary

const Sidebar = () => {
  return (
    <Box sx={{ width: 190, backgroundColor: '#E98EAD', height: '100vh', fontSize: '0.875rem' }} className="font-montserrat">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1, marginTop: 1, marginBottom: 2 }}>
        <img src={headerLogo} alt="Header Logo" style={{ maxWidth: '100%', height: 'auto' }} />
      </Box>
      <Divider sx={{ backgroundColor: 'white', width: '80%', margin: '0 auto' }} />
      <List>
        <Item title="Dashboard" path="/admin/dashboard" icon={<DashboardOutlined />} />
        <Item title="Products" path="/admin/products" icon={<StorefrontOutlined />} />
        <Item title="Users" path="/admin/users" icon={<PeopleAltOutlined />} />
      </List>
    </Box>
  );
};

export default Sidebar;