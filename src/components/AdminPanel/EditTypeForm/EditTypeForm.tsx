import React from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import './EditTypeForm.css';

const EditTypeForm: React.FC = () => {
  return (
    <Container className="edit-type-form">
      <Typography variant="h5" component="h2" className="edit-type-form-title">
        Edit Type
      </Typography>
      <form>
        <TextField 
          label="Type Name" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
        />
        <TextField 
          label="Variant Count" 
          type="number" 
          variant="outlined" 
          fullWidth 
          margin="normal" 
        />
        <Button variant="contained" color="primary" type="submit">
          Save
        </Button>
      </form>
    </Container>
  );
};

export default EditTypeForm;
