import React from 'react';
import { Container, Typography } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Hello, welcome to POD Helper!
      </Typography>
    </Container>
  );
};

export default HomePage;
