import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setMockupLightVariantOverlay, setMockupDarkVariantOverlay, setMockupOverlayPosition } from '../../redux/slices/mockupGeneratorSlice';
import { Typography, Button } from '@mui/material';
import { Rnd } from 'react-rnd';
import './PrimaryVariantsDisplay.css';

const PrimaryVariantsDisplay: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const lightVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.lightVariantOverlay);
  const darkVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.darkVariantOverlay);
  const overlayPosition = useSelector((state: RootState) => state.mockupGenerator.overlayPosition);

  const [lightVariantImage, setLightVariantImage] = useState<string | null>(null);
  const [darkVariantImage, setDarkVariantImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedType) {
      const lightVariant = selectedType.colorVariants.find(variant => variant.id === selectedType.primaryLightVariant);
      const darkVariant = selectedType.colorVariants.find(variant => variant.id === selectedType.primaryDarkVariant);

      if (lightVariant) {
        setLightVariantImage(lightVariant.imageUrl || null);
      }
      if (darkVariant) {
        setDarkVariantImage(darkVariant.imageUrl || null);
      }
    }
  }, [selectedType]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, variant: 'light' | 'dark') => {
    const file = event.target.files?.[0] || null;
    if (variant === 'light') {
      dispatch(setMockupLightVariantOverlay(file));
    } else {
      dispatch(setMockupDarkVariantOverlay(file));
    }
  };

  const getOverlayStyles = () => {
    if (!selectedType) return {};
    const { startX, startY, endX, endY } = selectedType.boundingOverlayBoxDimensions;
    const width = endX - startX;
    const height = endY - startY;
    return {
      left: `${(startX / 100) * 500}px`,
      top: `${(startY / 100) * 500}px`,
      width: `${(width / 100) * 500}px`,
      height: `${(height / 100) * 500}px`,
    };
  };

  return (
    <div className="primary-variants-display">
      <Typography variant="h6" gutterBottom>
        Primary Variants
      </Typography>
      <div className="variant-container">
        <div className="variant">
          <Typography variant="subtitle1">Light Variant</Typography>
          <div className="variant-wrapper">
            {lightVariantImage ? (
              <img src={lightVariantImage} alt="Light Variant" className="variant-image" />
            ) : (
              <Typography>No Image</Typography>
            )}
            <div className="overlay-box" style={getOverlayStyles()}>
              {lightVariantOverlay && (
                <img src={URL.createObjectURL(lightVariantOverlay)} alt="Overlay" className="overlay-image" />
              )}
              {!lightVariantOverlay && (
                <div className="red-box" />
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'light')}
            style={{ display: 'none' }}
            id="light-upload"
          />
          <label htmlFor="light-upload">
            <Button variant="contained" component="span">
              Upload Light Variant Overlay
            </Button>
          </label>
        </div>
        <div className="variant">
          <Typography variant="subtitle1">Dark Variant</Typography>
          <div className="variant-wrapper">
            {darkVariantImage ? (
              <img src={darkVariantImage} alt="Dark Variant" className="variant-image" />
            ) : (
              <Typography>No Image</Typography>
            )}
            <div className="overlay-box" style={getOverlayStyles()}>
              {darkVariantOverlay && (
                <img src={URL.createObjectURL(darkVariantOverlay)} alt="Overlay" className="overlay-image" />
              )}
              {!darkVariantOverlay && (
                <div className="red-box" />
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'dark')}
            style={{ display: 'none' }}
            id="dark-upload"
          />
          <label htmlFor="dark-upload">
            <Button variant="contained" component="span">
              Upload Dark Variant Overlay
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrimaryVariantsDisplay;
