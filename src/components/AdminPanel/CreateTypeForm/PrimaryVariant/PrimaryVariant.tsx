import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, TextField } from '@mui/material';
import { ColorVariant } from '../../../../types';
import './PrimaryVariant.css';

interface PrimaryVariantProps {
  colorVariants: ColorVariant[];
  primaryLightVariant: string;
  primaryDarkVariant: string;
  setPrimaryLightVariant: (id: string) => void;
  setPrimaryDarkVariant: (id: string) => void;
  boundingOverlayBoxDimensions: {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
  };
  setBoundingOverlayBoxDimensions: (dimensions: { startX: number; endX: number; startY: number; endY: number; }) => void;
}

const PrimaryVariant: React.FC<PrimaryVariantProps> = ({
  colorVariants,
  primaryLightVariant,
  primaryDarkVariant,
  setPrimaryLightVariant,
  setPrimaryDarkVariant,
  boundingOverlayBoxDimensions,
  setBoundingOverlayBoxDimensions,
}) => {
  return (
    <Box className="primary-variant-container">
      <Box className="primary-variant-dropdown">
        <FormControl fullWidth margin="normal">
          <InputLabel>Primary Light Variant</InputLabel>
          <Select
            value={primaryLightVariant}
            onChange={(e) => setPrimaryLightVariant(e.target.value as string)}
          >
            {colorVariants.map((variant) => (
              <MenuItem key={variant.id} value={variant.id}>
                {variant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className="primary-variant-image">
          {primaryLightVariant && (
            <img
              src={colorVariants.find(variant => variant.id === primaryLightVariant)?.imageUrl}
              alt="Primary Light Variant"
            />
          )}
        </Box>
      </Box>
      <Box className="primary-variant-dropdown">
        <FormControl fullWidth margin="normal">
          <InputLabel>Primary Dark Variant</InputLabel>
          <Select
            value={primaryDarkVariant}
            onChange={(e) => setPrimaryDarkVariant(e.target.value as string)}
          >
            {colorVariants.map((variant) => (
              <MenuItem key={variant.id} value={variant.id}>
                {variant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className="primary-variant-image">
          {primaryDarkVariant && (
            <img
              src={colorVariants.find(variant => variant.id === primaryDarkVariant)?.imageUrl}
              alt="Primary Dark Variant"
            />
          )}
        </Box>
      </Box>
      <Box className="overlay-box-coordinates">
        <TextField
          label="Start X"
          type="number"
          value={boundingOverlayBoxDimensions.startX}
          onChange={(e) => setBoundingOverlayBoxDimensions({
            ...boundingOverlayBoxDimensions,
            startX: parseFloat(e.target.value),
          })}
          margin="normal"
        />
        <TextField
          label="End X"
          type="number"
          value={boundingOverlayBoxDimensions.endX}
          onChange={(e) => setBoundingOverlayBoxDimensions({
            ...boundingOverlayBoxDimensions,
            endX: parseFloat(e.target.value),
          })}
          margin="normal"
        />
        <TextField
          label="Start Y"
          type="number"
          value={boundingOverlayBoxDimensions.startY}
          onChange={(e) => setBoundingOverlayBoxDimensions({
            ...boundingOverlayBoxDimensions,
            startY: parseFloat(e.target.value),
          })}
          margin="normal"
        />
        <TextField
          label="End Y"
          type="number"
          value={boundingOverlayBoxDimensions.endY}
          onChange={(e) => setBoundingOverlayBoxDimensions({
            ...boundingOverlayBoxDimensions,
            endY: parseFloat(e.target.value),
          })}
          margin="normal"
        />
      </Box>
    </Box>
  );
};

export default PrimaryVariant;
