import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@mui/material';
import { RootState } from '../../../redux/store';
import './GeneratedMockups.css';

const GeneratedMockups: React.FC = () => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const selectedType = useSelector((state: RootState) => state.mockupGenerator.selectedType);
  const selectedColorVariants = useSelector((state: RootState) => state.mockupGenerator.selectedColorVariants);
  const overlayCoords = useSelector((state: RootState) => state.mockupGenerator.overlayCoords);
  const lightVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.lightVariantOverlay);
  const darkVariantOverlay = useSelector((state: RootState) => state.mockupGenerator.darkVariantOverlay);

  const [mockupImages, setMockupImages] = useState<{ variantId: string; imageUrl: string; isDark: boolean; width: number; height: number; name: string }[]>([]);

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

  useEffect(() => {
    if (mockupImages.every(image => image.width !== 0 && image.height !== 0)) {
      setImagesLoaded(true);
    }
  }, [mockupImages]);

  const handleDownloadMockup = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx || !mockupImages.length) return;

    const mockup = mockupImages[0];
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = mockup.imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const overlayImg = new Image();
      overlayImg.crossOrigin = 'Anonymous';
      overlayImg.src = URL.createObjectURL(mockup.isDark ? darkVariantOverlay! : lightVariantOverlay!);

      overlayImg.onload = () => {
        const overlayWidth = overlayImg.width;
        const overlayHeight = overlayImg.height;

        // Calculate the aspect ratio maintained overlay dimensions within the bounds
        const boundsWidth = ((overlayCoords.endX - overlayCoords.startX) / 500) * img.width;
        const boundsHeight = ((overlayCoords.endY - overlayCoords.startY) / 500) * img.height;

        const aspectRatio = overlayWidth / overlayHeight;
        let displayWidth, displayHeight;
        if (boundsWidth / boundsHeight > aspectRatio) {
          displayHeight = boundsHeight;
          displayWidth = boundsHeight * aspectRatio;
        } else {
          displayWidth = boundsWidth;
          displayHeight = boundsWidth / aspectRatio;
        }

        const overlayLeft = (overlayCoords.startX / 500) * img.width;
        const overlayTop = (overlayCoords.startY / 500) * img.height;

        ctx.drawImage(overlayImg, overlayLeft, overlayTop, displayWidth, displayHeight);

        const link = document.createElement('a');
        link.download = 'mockup.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    };
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadMockup}
        disabled={!imagesLoaded}
      >
        Download Mockup
      </Button>
      <div className="mockup-grid" ref={captureRef}>
        {mockupImages.map((mockup, index) => (
          <div key={index} className="mockup-container generated-item">
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
                    left: `${(overlayCoords.startX / 500) * mockup.width}px`,
                    top: `${(overlayCoords.startY / 500) * mockup.height}px`,
                    width: `${((overlayCoords.endX - overlayCoords.startX) / 500) * mockup.width}px`,
                    height: `${((overlayCoords.endY - overlayCoords.startY) / 500) * mockup.height}px`,
                  }}
                />
              )}
            </div>
            <div className="text-wrapper">
              <Typography variant="body1" fontWeight="bold">
                {mockup.name}
              </Typography>
              <Typography variant="body2">Width: {mockup.width}px, Height: {mockup.height}px</Typography>
              <Typography variant="body2">Overlay Left: {(overlayCoords.startX / 500) * mockup.width}px</Typography>
              <Typography variant="body2">Overlay Top: {(overlayCoords.startY / 500) * mockup.height}px</Typography>
              <Typography variant="body2">Overlay Width: {((overlayCoords.endX - overlayCoords.startX) / 500) * mockup.width}px</Typography>
              <Typography variant="body2">Overlay Height: {((overlayCoords.endY - overlayCoords.startY) / 500) * mockup.height}px</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedMockups;
