import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { Button, Typography } from '@mui/material';
import { generateMockups } from '../../services/mockupGeneratorService';
import './GenerateMockups.css';

const GenerateMockups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);
  const lightVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.lightVariantOverlay);
  const darkVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.darkVariantOverlay);
  const overlayPosition = useSelector((state: RootState) => state.mockupGenerator.overlayPosition);

  const handleGenerateMockups = async () => {
    if (selectedType && lightVariantOverlay && darkVariantOverlay) {
      await generateMockups(selectedType, selectedColorVariants, lightVariantOverlay, darkVariantOverlay, overlayPosition);
    }
  };

  return (
    <div className="generate-mockups">
      <Typography variant="h6" gutterBottom>
        Generate Mockups
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGenerateMockups}>
        Generate Mockups
      </Button>
    </div>
  );
};

export default GenerateMockups;
