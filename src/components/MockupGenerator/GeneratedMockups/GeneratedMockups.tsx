import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { RootState } from '../../../redux/store';
import './GeneratedMockups.css';

const GeneratedMockups: React.FC = () => {
  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);
  const overlayCoords = useSelector((state: RootState) => state.mockupGenerator.overlayCoords);
  const lightVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.lightVariantOverlay);
  const darkVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.darkVariantOverlay);
  const [mockupImages, setMockupImages] = useState<{ variantId: string; imageUrl: string; isDark: boolean; width: number; height: number; name: string }[]>([]);

  const calculateOverlayLeft = (imageWidth: number) => {
    return (overlayCoords.startX / 500) * imageWidth;
  };

  const calculateOverlayTop = (imageHeight: number) => {
    return (overlayCoords.startY / 500) * imageHeight;
  };

  const calculateOverlayWidth = (imageWidth: number) => {
    return ((overlayCoords.endX - overlayCoords.startX) / 500) * imageWidth;
  };

  const calculateOverlayHeight = (imageHeight: number) => {
    return ((overlayCoords.endY - overlayCoords.startY) / 500) * imageHeight;
  };

  useEffect(() => {
    if (selectedType) {
      const images = selectedType.colorVariants
        .filter(variant => selectedColorVariants.includes(variant.id))
        .map(variant => ({
          variantId: variant.id,
          imageUrl: variant.imageUrl || '',
          isDark: variant.isDark,
          width: 0,
          height: 0,
          name: variant.name,
        }));
      setMockupImages(images);
    }
  }, [selectedType, selectedColorVariants]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    const { width, height } = event.currentTarget.getBoundingClientRect();
    setMockupImages(prevImages =>
      prevImages.map((image, i) => i === index ? { ...image, width, height } : image)
    );
  };

  return (
    <div>
      <div className="mockup-grid">
        {mockupImages.map((mockup, index) => (
          <div key={index} className="mockup-container">
            <div className="image-wrapper">
              <img
                src={mockup.imageUrl}
                alt={`Mockup ${index}`}
                className="variant-image"
                onLoad={(event) => handleImageLoad(event, index)}
              />
              {(mockup.isDark ? darkVariantOverlay : lightVariantOverlay) && (
                <img
                  src={URL.createObjectURL(mockup.isDark ? darkVariantOverlay! : lightVariantOverlay!)}
                  alt="Overlay"
                  className="overlay-image"
                  style={{
                    left: `${calculateOverlayLeft(mockup.width)}px`,
                    top: `${calculateOverlayTop(mockup.height)}px`,
                    width: `${calculateOverlayWidth(mockup.width)}px`,
                    height: `${calculateOverlayHeight(mockup.height)}px`,
                  }}
                />
              )}
            </div>
            <div className="text-wrapper">
              <Typography variant="body1" fontWeight="bold">
                {mockup.name}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedMockups;
