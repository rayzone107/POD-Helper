import React from 'react';
import { Container, Typography } from '@mui/material';
import Toolbar from '../components/common/Toolbar/Toolbar';
import GeneratedMockups from '../components/MockupGenerator/GeneratedMockups/GeneratedMockups';
import { APP_PADDING } from '../utils/constants';

const GeneratedMockupsPage: React.FC = () => {
  return (
    <>
      <Toolbar showBackButton />
      <Container style={{ padding: APP_PADDING }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generated Mockups
        </Typography>
        <GeneratedMockups />
      </Container>
    </>
  );
};

export default GeneratedMockupsPage;
