import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#3A4F7A' }}>
      <Toolbar>
      <Typography variant="h6" className="font-montserrat">
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;