import React, { useState } from 'react';
import { Box, List, Divider, IconButton, Typography } from '@mui/material';
import { DashboardOutlined, StorefrontOutlined, PeopleAltOutlined, ExpandLess, ExpandMore } from '@mui/icons-material';
import Item from './Item';
import headerLogo from '../../assets/images/header-logo.svg'; 

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      sx={{
        width: isExpanded ? 190 : 60,
        backgroundColor: '#E98EAD',
        height: '170vh',
        fontSize: '0.875rem',
        transition: 'width 0.3s',
        position: 'relative',
        fontFamily: 'Montserrat, sans-serif' // Apply Montserrat font
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: isExpanded ? 'space-between' : 'center',
          alignItems: 'center',
          padding: 1,
          marginTop: 1,
          marginBottom: 2
        }}
      >
        {isExpanded && <img src={headerLogo} alt="Header Logo" style={{ maxWidth: '100%', height: 'auto' }} />}
      </Box>
      <Divider sx={{ backgroundColor: 'white', width: isExpanded ? '80%' : '100%', margin: '0 auto' }} />
      <List>
        <Item title="Dashboard" path="/admin/dashboard" icon={<DashboardOutlined />} isExpanded={isExpanded} />
        <Item title="Products" path="/admin/products" icon={<StorefrontOutlined />} isExpanded={isExpanded} />
        <Item title="Users" path="/admin/users" icon={<PeopleAltOutlined />} isExpanded={isExpanded} />
        <Item title="Orders" path="/admin/Order" icon={<PeopleAltOutlined />} isExpanded={isExpanded} />
      </List>
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
        }}
      >
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    </Box>
  );
};

export default Sidebar;