import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import './PricingCalculatorCard.css';

const PricingCalculatorCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="home-card" onClick={() => navigate('/pricing-calculator')}>
      <CardContent className="card-content">
        <AttachMoneyIcon className="card-icon" />
        <Typography variant="h4" component="div" className="card-title">
          Pricing Calculator
        </Typography>
        <Typography variant="body1" className="card-description">
          Generate prices for both Etsy and Shopify for all items based on inputs for discounts, running Ads and profit percentage.
        </Typography>
        <Button variant="outlined" color="primary">
          Go to Pricing Calculator
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCalculatorCard;
