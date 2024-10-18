import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Item = ({ title, path, icon, isExpanded }) => {
  const location = useLocation();
  return (
    <ListItem
      button
      component={Link}
      to={path}
      selected={location.pathname === path}
      sx={{
        color: 'white',
        '&:hover': {
          color: '#FFC6D3',
          '& .MuiListItemIcon-root': {
            color: '#FFC6D3',
          },
        },
        '&.Mui-selected': {
          color: '#FFC6D3',
          '& .MuiListItemIcon-root': {
            color: '#FFC6D3',
          },
        },
      }}
    >
      <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
      {isExpanded && <ListItemText primary={title} sx={{ fontSize: '0.875rem' }} />} {/* Conditionally render text */}
    </ListItem>
  );
};

export default Item;