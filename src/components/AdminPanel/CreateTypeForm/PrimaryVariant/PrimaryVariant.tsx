import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { ColorVariant } from '../../../../types';
import './PrimaryVariant.css';

interface PrimaryVariantProps {
  colorVariants: ColorVariant[];
  primaryLightVariant: string;
  primaryDarkVariant: string;
  setPrimaryLightVariant: (variantId: string) => void;
  setPrimaryDarkVariant: (variantId: string) => void;
}

const PrimaryVariant: React.FC<PrimaryVariantProps> = ({
  colorVariants,
  primaryLightVariant,
  primaryDarkVariant,
  setPrimaryLightVariant,
  setPrimaryDarkVariant,
}) => {
  return (
    <div className="primary-variant">
      <div className="primary-variant-section">
        <FormControl fullWidth margin="normal">
          <InputLabel>Primary Light Variant</InputLabel>
          <Select
            value={primaryLightVariant}
            onChange={(e) => setPrimaryLightVariant(e.target.value)}
          >
            {colorVariants.map((variant) => (
              <MenuItem key={variant.id} value={variant.id}>
                {variant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="subtitle1">Preview:</Typography>
        {primaryLightVariant && (
          <img
            src={colorVariants.find((variant) => variant.id === primaryLightVariant)?.imageUrl}
            alt="Primary Light Variant"
            className="primary-variant-img"
          />
        )}
      </div>
      <div className="primary-variant-section">
        <FormControl fullWidth margin="normal">
          <InputLabel>Primary Dark Variant</InputLabel>
          <Select
            value={primaryDarkVariant}
            onChange={(e) => setPrimaryDarkVariant(e.target.value)}
          >
            {colorVariants.map((variant) => (
              <MenuItem key={variant.id} value={variant.id}>
                {variant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="subtitle1">Preview:</Typography>
        {primaryDarkVariant && (
          <img
            src={colorVariants.find((variant) => variant.id === primaryDarkVariant)?.imageUrl}
            alt="Primary Dark Variant"
            className="primary-variant-img"
          />
        )}
      </div>
    </div>
  );
};

export default PrimaryVariant;
