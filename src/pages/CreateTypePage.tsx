import React from 'react';
import { Container } from '@mui/material';
import CreateTypeForm from '../components/AdminPanel/CreateTypeForm/CreateTypeForm';

const CreateTypePage: React.FC = () => {
  return (
    <Container>
      <CreateTypeForm />
    </Container>
  );
};

export default CreateTypePage;
