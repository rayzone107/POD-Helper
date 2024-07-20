import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCategories, fetchAllBrands, fetchTypes } from '../../redux/actions';
import { setMockupSelectedCategory, setMockupSelectedBrand, setMockupSelectedType } from '../../redux/slices/mockupGeneratorSlice';
import { Grid, FormControl, InputLabel, Select, MenuItem, Divider, Typography, Container } from '@mui/material';
import PrimaryVariantsDisplay from './PrimaryVariantsDisplay';
import ColorVariantsSelector from './ColorVariantsSelector';
import GenerateMockups from './GenerateMockups';
import { APP_PADDING } from '../../utils/constants';
import './MockupGenerator.css';

const MockupGenerator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  const types = useSelector((state: RootState) => state.types.types);
  const selectedCategory = useSelector((state: RootState) => state.mockupGenerator.selectedCategory);
  const selectedBrand = useSelector((state: RootState) => state.mockupGenerator.selectedBrand);
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchTypes());
  }, [dispatch]);

  return (
    <Container style={{ padding: APP_PADDING }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mockup Generator
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => dispatch(setMockupSelectedCategory(e.target.value))}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Brand</InputLabel>
            <Select
              value={selectedBrand}
              onChange={(e) => dispatch(setMockupSelectedBrand(e.target.value))}
              disabled={!selectedCategory}
            >
              {brands
                .filter((brand) => brand.categoryId === selectedCategory)
                .map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType ? selectedType.id : ''}
              onChange={(e) =>
                dispatch(setMockupSelectedType(types.find((type) => type.id === e.target.value) || null))
              }
              disabled={!selectedBrand}
            >
              {types
                .filter((type) => type.categoryId === selectedCategory && type.brandId === selectedBrand)
                .map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
          </Select>
          </FormControl>
        </Grid>
        <Divider style={{ margin: '20px 0', width: '100%' }} />
        {selectedType && (
          <>
            <PrimaryVariantsDisplay />
            <Divider style={{ margin: '20px 0', width: '100%' }} />
            <ColorVariantsSelector />
            <Divider style={{ margin: '20px 0', width: '100%' }} />
            <GenerateMockups />
          </>
        )}
      </Grid>
    </Container>
  );
};

export default MockupGenerator;
