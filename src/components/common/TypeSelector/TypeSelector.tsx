import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchCategories, fetchAllBrands, fetchTypes } from '../../../redux/actions';
import { Category, Brand, Type } from '../../../types';
import { Box, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import './TypeSelector.css';

interface TypeSelectorProps {
  selectedCategory: string;
  selectedBrand: string;
  selectedType: Type | null;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onTypeChange: (type: Type | null) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedCategory,
  selectedBrand,
  selectedType,
  onCategoryChange,
  onBrandChange,
  onTypeChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector((state: RootState) => state.categories.categories);
  const brands = useSelector((state: RootState) => state.brands.brands);
  const types = useSelector((state: RootState) => state.types.types);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllBrands());
    dispatch(fetchTypes());
  }, [dispatch]);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    onBrandChange('');
    onTypeChange(null);
  };

  const handleBrandClick = (brand: string) => {
    onBrandChange(brand);
    onTypeChange(null);
  };

  const handleTypeClick = (type: Type) => {
    onTypeChange(type);
  };

  // Filter categories to only include those with brands that have types
  const filteredCategories = categories.filter((category) =>
    brands.some((brand) =>
      brand.categoryId === category.id &&
      types.some((type) => type.brandId === brand.id)
    )
  );

  // Filter brands to only include those with types
  const filteredBrands = brands.filter((brand) =>
    types.some((type) => type.brandId === brand.id)
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Typography variant="h6">Categories</Typography>
        <Box className="type-selector-box">
          <List>
            {filteredCategories.map((category: Category) => (
              <ListItem
                button
                key={category.id}
                selected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                <ListItemText primary={category.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6">Brands</Typography>
        {selectedCategory && (
          <Box className="type-selector-box">
            <List>
              {filteredBrands
                .filter((brand: Brand) => brand.categoryId === selectedCategory)
                .map((brand: Brand) => (
                  <ListItem
                    button
                    key={brand.id}
                    selected={selectedBrand === brand.id}
                    onClick={() => handleBrandClick(brand.id)}
                  >
                    <ListItemText primary={brand.name} />
                  </ListItem>
                ))}
            </List>
          </Box>
        )}
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h6">Types</Typography>
        {selectedBrand && (
          <Box className="type-selector-box">
            <List>
              {types
                .filter((type: Type) => type.categoryId === selectedCategory && type.brandId === selectedBrand)
                .map((type: Type) => (
                  <ListItem
                    button
                    key={type.id}
                    selected={selectedType?.id === type.id}
                    onClick={() => handleTypeClick(type)}
                  >
                    <ListItemText primary={type.name} />
                  </ListItem>
                ))}
            </List>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default TypeSelector;
