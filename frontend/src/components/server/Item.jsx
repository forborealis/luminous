import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  return (
    <ListItem button component={Link} to={path} selected={location.pathname === path}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
};

export default Item;