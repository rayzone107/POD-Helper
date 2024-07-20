import React from 'react';
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, variant: 'light' | 'dark') => {
    const file = event.target.files?.[0] || null;
    if (variant === 'light') {
      dispatch(setMockupLightVariantOverlay(file));
    } else {
      dispatch(setMockupDarkVariantOverlay(file));
    }
  };

  return (
    <div className="primary-variants-display">
      <Typography variant="h6" gutterBottom>
        Primary Variants
      </Typography>
      <div className="variant-container">
        <div className="variant">
          <Typography variant="subtitle1">Light Variant</Typography>
          <img src={selectedType?.primaryLightVariant} alt="Light Variant" className="variant-image" />
          <Rnd
            bounds="parent"
            size={{ width: overlayPosition.width, height: overlayPosition.height }}
            position={{ x: overlayPosition.x, y: overlayPosition.y }}
            onDragStop={(e, d) => {
              dispatch(setMockupOverlayPosition({ x: d.x, y: d.y, width: overlayPosition.width, height: overlayPosition.height }));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              dispatch(setMockupOverlayPosition({
                x: position.x,
                y: position.y,
                width: ref.style.width ? parseInt(ref.style.width, 10) : overlayPosition.width,
                height: ref.style.height ? parseInt(ref.style.height, 10) : overlayPosition.height,
              }));
            }}
          >
            {lightVariantOverlay && (
              <img src={URL.createObjectURL(lightVariantOverlay)} alt="Overlay" className="overlay-image" />
            )}
          </Rnd>
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
          <img src={selectedType?.primaryDarkVariant} alt="Dark Variant" className="variant-image" />
          {darkVariantOverlay && (
            <div
              className="overlay-box"
              style={{
                top: `${overlayPosition.y}%`,
                left: `${overlayPosition.x}%`,
                width: `${overlayPosition.width}%`,
                height: `${overlayPosition.height}%`,
              }}
            >
              <img src={URL.createObjectURL(darkVariantOverlay)} alt="Overlay" className="overlay-image" />
            </div>
          )}
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
