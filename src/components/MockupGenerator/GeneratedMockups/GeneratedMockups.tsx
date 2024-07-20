import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid } from '@mui/material';
import { RootState } from '../../../redux/store';
import './GeneratedMockups.css';

const GeneratedMockups: React.FC = () => {
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);
  const lightVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.lightVariantOverlay);
  const darkVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.darkVariantOverlay);
  const overlayPosition = useSelector((state: RootState) => state.mockupGenerator.overlayPosition);
  const [mockupImages, setMockupImages] = useState<{ variantId: string; imageUrl: string; isDark: boolean }[]>([]);

  useEffect(() => {
    if (selectedType) {
      const images = selectedType.colorVariants
        .filter(variant => selectedColorVariants.includes(variant.id))
        .map(variant => ({
          variantId: variant.id,
          imageUrl: variant.imageUrl || '',
          isDark: variant.isDark,
        }));
      setMockupImages(images);
    }
  }, [selectedType, selectedColorVariants]);

  const getOverlayStyles = (variantId: string, isDark: boolean) => {
    const overlayImage = isDark ? darkVariantOverlay : lightVariantOverlay;
    if (!overlayImage) return {};

    const { startX, startY, endX, endY } = selectedType!.boundingOverlayBoxDimensions;
    const width = endX - startX;
    const height = endY - startY;

    return {
      position: 'absolute' as 'absolute',
      left: `${(startX / 100) * 600}px`,
      top: `${(startY / 100) * 600}px`,
      width: `${(width / 100) * 600}px`,
      height: `${(height / 100) * 600}px`,
      objectFit: 'contain' as 'contain',
    };
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Generated Mockups
      </Typography>
      <div className="mockup-grid">
        {mockupImages.map((mockup, index) => (
          <div key={index} className="mockup-container">
            <div className="image-wrapper">
              <img src={mockup.imageUrl} alt={`Mockup ${index}`} className="variant-image" />
              <img
                src={URL.createObjectURL(mockup.isDark ? darkVariantOverlay! : lightVariantOverlay!)}
                alt="Overlay"
                className="overlay-image"
                style={getOverlayStyles(mockup.variantId, mockup.isDark)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedMockups;
