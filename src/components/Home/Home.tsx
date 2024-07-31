// src/components/Home/Home.tsx
import React from 'react';
import { Grid, Container } from '@mui/material';
import MockupGeneratorCard from './MockupGeneratorCard/MockupGeneratorCard';
import PricingCalculatorCard from './PricingCalculatorCard/PricingCalculatorCard';
import './Home.css';

const Home: React.FC = () => {
  return (
    <Container className="home-container">
      <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} sm={6}>
          <PricingCalculatorCard />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MockupGeneratorCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
