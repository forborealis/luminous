import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("firebaseUID");
    localStorage.removeItem("checkoutDetails");
    localStorage.removeItem("notifications");
    window.dispatchEvent(new Event('loginStateChange')); // Dispatch the event
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3A4F7A' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
          Admin Dashboard
        </Typography>
        <IconButton color="inherit" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;