import React from 'react';
import { AppBar, Toolbar as MuiToolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import './Toolbar.css';

const Toolbar: React.FC = () => {
  return (
    <AppBar position="fixed">
      <MuiToolbar>
        <Link to="/" className="toolbar-title">
          POD Helper
        </Link>
        <Link to="/admin" className="toolbar-link">
          <Button color="inherit" startIcon={<DashboardIcon />}>Admin Panel</Button>
        </Link>
        <Link to="/pricing-calculator" className="toolbar-link">
          <Button color="inherit" startIcon={<AttachMoneyIcon />}>Pricing Calculator</Button>
        </Link>
        <Link to="/mockup" className="toolbar-link">
          <Button color="inherit" startIcon={<ImageIcon />}>Mockup Generator</Button>
        </Link>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
