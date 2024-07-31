// src/components/Home/MockupGeneratorCard/MockupGeneratorCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import './MockupGeneratorCard.css';

const MockupGeneratorCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="home-card" onClick={() => navigate('/mockup-generator')}>
      <CardContent className="card-content">
        <DesignServicesIcon className="card-icon" />
        <Typography variant="h4" component="div" className="card-title">
          Mockup Generator
        </Typography>
        <Typography variant="body1" className="card-description">
          For any of the items, generate a grid of images with all colors with the overlay's on top. This can be used for the Color options.
        </Typography>
        <Button variant="outlined" color="primary">
          Go to Mockup Generator
        </Button>
      </CardContent>
    </Card>
  );
};

export default MockupGeneratorCard;
