import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DropdownMenu from './DropdownMenu';
import logo from '../assets/Logo.png';

const Header = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      {/* Thêm position: 'relative' cho Toolbar để làm điểm neo cho các phần tử con tuyệt đối */}
      <Toolbar sx={{ position: 'relative', minHeight: '80px' }}> 
        
        {/* Logo giữ nguyên bên trái */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Bỏ marginRight: '100px' vì không cần thiết nữa */}
          <img src={logo} alt="logo" style={{ height: '70px' }} /> 
        </Box>

        {/* --- PHẦN TIÊU ĐỀ ĐƯỢC CĂN GIỮA TUYỆT ĐỐI --- */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            position: 'absolute',      // Tách ra khỏi dòng chảy Flexbox
            left: '50%',               // Đặt điểm bắt đầu ở chính giữa Toolbar
            transform: 'translateX(-50%)', // Dịch ngược lại 50% chiều rộng của chính nó để căn giữa hoàn hảo
            textAlign: 'center',
            fontWeight: 'bold',        // Thêm in đậm cho nổi bật (tùy chọn)
            width: 'auto',             // Độ rộng tự động theo nội dung
            whiteSpace: 'nowrap',      // Giữ trên 1 dòng
            // Responsive: Tự nhỏ lại trên màn hình bé
            typography: { xs: 'subtitle1', md: 'h5' } 
          }}
        >
          Automatic Welding Seam Tracking System
        </Typography>
        {/* ------------------------------------------- */}

        {/* Menu bên phải giữ nguyên vị trí */}
        <Box sx={{ position: 'absolute', right: 16 }}>
          <DropdownMenu />
        </Box>
        
      </Toolbar>
    </AppBar>
  );
};

export default Header;
