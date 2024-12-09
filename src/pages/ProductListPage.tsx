import React from 'react';
import { Container } from '@mui/material';
import ProductList from '../components/ProductsList/ProductList';

const ProductListPage: React.FC = () => {
  return (
    <Container>
      <ProductList />
    </Container>
  );
};

export default ProductListPage;
