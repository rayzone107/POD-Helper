import React from 'react';
import { Container, Typography } from '@mui/material';
import EditCategoriesForm from '../components/AdminPanel/EditCategoriesForm/EditCategoriesForm';
import EditBrandsForm from '../components/AdminPanel/EditBrandsForm/EditBrandsForm';
import { APP_PADDING } from '../utils/constants';

const EditCategoriesPage: React.FC = () => {
  return (
    <Container style={{ padding: APP_PADDING }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Categories and Brands
      </Typography>
      <EditCategoriesForm />
      <EditBrandsForm />
    </Container>
  );
};

export default EditCategoriesPage;
