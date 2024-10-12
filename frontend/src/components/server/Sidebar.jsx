import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { DashboardOutlined, StorefrontOutlined, PeopleAltOutlined } from '@mui/icons-material';
import Item from './Item';

const Sidebar = () => {
  return (
    <Box sx={{ width: 250, backgroundColor: '#f4f4f4', height: '100vh' }}>
      <List>
        <Item title="Dashboard" path="/admin/dashboard" icon={<DashboardOutlined />} />
        <Item title="Products" path="/admin/products" icon={<StorefrontOutlined />} />
        <Item title="Users" path="/admin/users" icon={<PeopleAltOutlined />} />
      </List>
    </Box>
  );
};

export default Sidebar;