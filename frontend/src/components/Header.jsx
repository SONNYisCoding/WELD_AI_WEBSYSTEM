import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DropdownMenu from './DropdownMenu';
import logo from '../assets/Logo.png';

const Header = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ position: 'relative', minHeight: '80px' }}> 
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="logo" style={{ height: '70px' }} /> 
        </Box>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontWeight: 'bold',
            width: 'auto',
            whiteSpace: 'nowrap',
            typography: { xs: 'subtitle1', md: 'h5' } 
          }}
        >
          Automatic Welding Seam Tracking System
        </Typography>

        <Box sx={{ position: 'absolute', right: 16 }}>
          <DropdownMenu />
        </Box>
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;
