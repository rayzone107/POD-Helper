import React from 'react';
import { Container } from '@mui/material';
import CreateTypeForm from '../components/AdminPanel/CreateTypeForm/CreateTypeForm';

interface CreateTypePageProps {
  mode: 'create' | 'edit';
}

const CreateTypePage: React.FC<CreateTypePageProps> = ({ mode }) => {
  return (
    <Container>
      <CreateTypeForm mode={mode} />
    </Container>
  );
};

export default CreateTypePage;
