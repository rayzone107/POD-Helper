import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, fetchBrands } from '../../../redux/actions';
import './CreateTypeForm.css';

const CreateTypeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [colorVariants, setColorVariants] = useState([]);
  const [sizeVariants, setSizeVariants] = useState([]);
  const [primaryLightVariant, setPrimaryLightVariant] = useState('');
  const [primaryDarkVariant, setPrimaryDarkVariant] = useState('');
  const [boundingOverlayBoxDimensions, setBoundingOverlayBoxDimensions] = useState({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  });

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchBrands(categoryId));
    }
  }, [categoryId, dispatch]);

  const handleSave = () => {
    // Logic to save the type to Firestore and upload images to Firebase Storage
  };

  return (
    <Container className="create-type-form">
      <Typography variant="h5" component="h2" className="create-type-form-title">
        Create Type
      </Typography>
      <form>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!categoryId}>
          <InputLabel>Brand</InputLabel>
          <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
            {brands
              .filter((brand) => brand.categoryId === categoryId)
              .map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          label="Type Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Add fields for colorVariants, sizeVariants, primaryLightVariant, primaryDarkVariant, boundingOverlayBoxDimensions */}
        
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </form>
    </Container>
  );
};

export default CreateTypeForm;
