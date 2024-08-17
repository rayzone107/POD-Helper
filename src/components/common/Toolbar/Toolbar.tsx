import React from 'react';
import { AppBar, Toolbar as MuiToolbar, Button, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Toolbar.css';

interface ToolbarProps {
  showBackButton?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ showBackButton }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <MuiToolbar>
        {showBackButton && (
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        )}
        <Link to="/" className="toolbar-title">
          POD Helper
        </Link>
        <Link to="/admin" className="toolbar-link">
          <Button color="inherit" startIcon={<DashboardIcon />}>Admin Panel</Button>
        </Link>
        <Link to="/pricing-calculator" className="toolbar-link">
          <Button color="inherit" startIcon={<AttachMoneyIcon />}>Pricing Calculator</Button>
        </Link>
        <Link to="/mockup-generator" className="toolbar-link">
          <Button color="inherit" startIcon={<ImageIcon />}>Mockup Generator</Button>
        </Link>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
