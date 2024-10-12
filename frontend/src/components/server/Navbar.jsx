import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#E98EAD' }}>
      <Toolbar>
        <Typography variant="h6">
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;