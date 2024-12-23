import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../redux/store';
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
    if (selectedType) {
      if (lightVariantOverlay && darkVariantOverlay) {
        const overlayCoords = {
          startX: overlayPosition.x.toString(),
          startY: overlayPosition.y.toString(),
          endX: (overlayPosition.x + overlayPosition.width).toString(),
          endY: (overlayPosition.y + overlayPosition.height).toString(),
        };
        const coordsQuery = new URLSearchParams(overlayCoords).toString();
        navigate(`/generated-mockups?${coordsQuery}`);
      } else {
        // Navigate without any overlay parameters if no overlays are provided
        navigate('/generated-mockups');
      }
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
