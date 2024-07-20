import React from 'react';
import { Container, Typography } from '@mui/material';
import PricingCalculator from '../components/PricingCalculator/PricingCalculator';
import { APP_PADDING } from '../utils/constants';

const PricingCalculatorPage: React.FC = () => {
  return (
    <Container style={{ padding: APP_PADDING }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pricing Calculator
      </Typography>
      <PricingCalculator />
    </Container>
  );
};

export default PricingCalculatorPage;
