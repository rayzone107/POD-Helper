import React from 'react';
import { Container, Typography } from '@mui/material';
import GeneratedMockups from '../components/MockupGenerator/GeneratedMockups/GeneratedMockups';
import { APP_PADDING } from '../utils/constants';

const GeneratedMockupsPage: React.FC = () => {
  return (
    <Container style={{ padding: APP_PADDING }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Generated Mockups
      </Typography>
      <GeneratedMockups />
    </Container>
  );
};

export default GeneratedMockupsPage;
