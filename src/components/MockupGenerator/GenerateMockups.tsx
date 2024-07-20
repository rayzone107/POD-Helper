import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../redux/store';
import { Button, Typography } from '@mui/material';
import './GenerateMockups.css';

const GenerateMockups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);
  const lightVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.lightVariantOverlay);
  const darkVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.darkVariantOverlay);
  const overlayPosition = useSelector((state: RootState) => state.mockupGenerator.overlayPosition);

  const navigate = useNavigate();

  const handleGenerateMockups = () => {
    console.log('Selected Type:', selectedType);
    console.log('Selected Color Variants:', selectedColorVariants);
    console.log('Light Variant Overlay:', lightVariantOverlay);
    console.log('Dark Variant Overlay:', darkVariantOverlay);
    console.log('Overlay Position:', overlayPosition);

    if (selectedType && lightVariantOverlay && darkVariantOverlay) {
      navigate('/generated-mockups');
    } else {
      console.error('Required data not available to generate mockups.');
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
