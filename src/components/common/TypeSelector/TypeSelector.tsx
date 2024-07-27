import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, fetchAllBrands, fetchTypes } from '../../../redux/actions';
import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { Category, Brand, Type } from '../../../types';
import './TypeSelector.css';

interface TypeSelectorProps {
  selectedCategory: string;
  selectedBrand: string;
  selectedType: Type | null;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onTypeChange: (type: Type | null) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedCategory, selectedBrand, selectedType, onCategoryChange, onBrandChange, onTypeChange }) => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  const types = useSelector((state: RootState) => state.types.types);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchTypes());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((category: Category) => (
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
            onChange={(e) => onBrandChange(e.target.value)}
            disabled={!selectedCategory}
          >
            {brands
              .filter((brand: Brand) => brand.categoryId === selectedCategory)
              .map((brand: Brand) => (
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
            onChange={(e) => {
              const selected = types.find((type: Type) => type.id === e.target.value) || null;
              onTypeChange(selected);
            }}
            disabled={!selectedBrand}
          >
            {types
              .filter((type: Type) => type.categoryId === selectedCategory && type.brandId === selectedBrand)
              .map((type: Type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default TypeSelector;
