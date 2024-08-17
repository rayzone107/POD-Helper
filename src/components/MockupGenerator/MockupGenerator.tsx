import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setMockupSelectedCategory, setMockupSelectedBrand, setMockupSelectedType } from '../../redux/slices/mockupGeneratorSlice';
import { Divider, Typography, Container } from '@mui/material';
import PrimaryVariantsDisplay from './PrimaryVariantsDisplay/PrimaryVariantsDisplay';
import { APP_PADDING } from '../../utils/constants';
import './MockupGenerator.css';
import GenerateMockups from './GenerateMockups/GenerateMockups';
import ColorVariantsSelector from './ColorVariantsSelector/ColorVariantsSelector';
import TypeSelector from '../common/TypeSelector/TypeSelector';
import { Type } from '../../types';

const MockupGenerator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectedCategory = useSelector((state: RootState) => state.mockupGenerator.selectedCategory);
  const selectedBrand = useSelector((state: RootState) => state.mockupGenerator.selectedBrand);
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);

  const handleCategoryChange = (category: string) => {
    dispatch(setMockupSelectedCategory(category));
  };

  const handleBrandChange = (brand: string) => {
    dispatch(setMockupSelectedBrand(brand));
  };

  const handleTypeChange = (type: Type | null) => {
    dispatch(setMockupSelectedType(type));
  };

  return (
    <Container style={{ padding: APP_PADDING }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mockup Generator
      </Typography>
      <TypeSelector
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        selectedType={selectedType}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onTypeChange={handleTypeChange}
      />
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
    </Container>
  );
};

export default MockupGenerator;
