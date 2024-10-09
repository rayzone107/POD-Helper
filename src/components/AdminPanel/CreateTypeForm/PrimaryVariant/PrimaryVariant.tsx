import React, { useRef, useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, TextField } from '@mui/material';
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
  const lightVariantImgRef = useRef<HTMLImageElement>(null);
  const darkVariantImgRef = useRef<HTMLImageElement>(null);
  const [lightImageDims, setLightImageDims] = useState({ width: 0, height: 0 });
  const [darkImageDims, setDarkImageDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (lightVariantImgRef.current) {
      setLightImageDims({
        width: lightVariantImgRef.current.clientWidth,
        height: lightVariantImgRef.current.clientHeight,
      });
    }
    if (darkVariantImgRef.current) {
      setDarkImageDims({
        width: darkVariantImgRef.current.clientWidth,
        height: darkVariantImgRef.current.clientHeight,
      });
    }
  }, [primaryLightVariant, primaryDarkVariant]);

  const renderOverlayBox = (dims: { width: number; height: number }) => {
    const { startX, endX, startY, endY } = boundingOverlayBoxDimensions;
    return (
      <div
        className="overlay-box"
        style={{
          left: `${(startX / 100) * dims.width}px`,
          top: `${(startY / 100) * dims.height}px`,
          width: `${((endX - startX) / 100) * dims.width}px`,
          height: `${((endY - startY) / 100) * dims.height}px`,
        }}
      />
    );
  };

  const handleInputChange = (field: string, value: string) => {
    const parsedValue = parseFloat(value);
    if (parsedValue >= 0 && parsedValue <= 100) {
      setBoundingOverlayBoxDimensions({
        ...boundingOverlayBoxDimensions,
        [field]: parsedValue,
      });
    }
  };

  return (
    <div>
      <h2>Primary Variants</h2>
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
              <>
                <img
                  ref={lightVariantImgRef}
                  src={colorVariants.find(variant => variant.id === primaryLightVariant)?.imageUrl}
                  alt="Primary Light Variant"
                />
                {renderOverlayBox(lightImageDims)}
              </>
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
              <>
                <img
                  ref={darkVariantImgRef}
                  src={colorVariants.find(variant => variant.id === primaryDarkVariant)?.imageUrl}
                  alt="Primary Dark Variant"
                />
                {renderOverlayBox(darkImageDims)}
              </>
            )}
          </Box>
        </Box>
        <Box className="overlay-box-coordinates">
          <TextField
            label="Start X (%)"
            type="number"
            value={boundingOverlayBoxDimensions.startX}
            onChange={(e) => handleInputChange('startX', e.target.value)}
            margin="normal"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
          <TextField
            label="End X (%)"
            type="number"
            value={boundingOverlayBoxDimensions.endX}
            onChange={(e) => handleInputChange('endX', e.target.value)}
            margin="normal"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
          <TextField
            label="Start Y (%)"
            type="number"
            value={boundingOverlayBoxDimensions.startY}
            onChange={(e) => handleInputChange('startY', e.target.value)}
            margin="normal"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
          <TextField
            label="End Y (%)"
            type="number"
            value={boundingOverlayBoxDimensions.endY}
            onChange={(e) => handleInputChange('endY', e.target.value)}
            margin="normal"
            InputProps={{ inputProps: { min: 0, max: 100 } }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default PrimaryVariant;
