import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const OJT_PROJECTS = [
  { name: "Automatic Welding Seam Tracking System", link: "/" },
  { name: "Project A", link: "#" },
  { name: "Project B", link: "#" },
];

const DropdownMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="ojt-projects-button"
        aria-controls={open ? 'ojt-projects-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ 
          color: 'white',
          textTransform: 'none',
        }}
      >
        <Typography variant="body1">More Research</Typography>
      </Button>
      <Menu
        id="ojt-projects-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'ojt-projects-button',
        }}
      >
        {OJT_PROJECTS.map((project) => (
          <MenuItem key={project.name} onClick={handleClose} component="a" href={project.link}>
            {project.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownMenu;
