import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@mui/material';
import { RootState } from '../../../redux/store';
import html2canvas from 'html2canvas';
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
    const totalGroups = Math.ceil(mockupImages.length / 9);

    for (let i = 0; i < totalGroups; i++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const group = mockupImages.slice(i * 9, (i + 1) * 9);
      const numCols = Math.min(3, group.length); // Number of columns based on items in the group
      const numRows = Math.ceil(group.length / 3); // Number of rows

      canvas.width = numCols * 600;
      canvas.height = numRows * 600;

      for (let j = 0; j < group.length; j++) {
        const mockup = group[j];
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = mockup.imageUrl;

        await new Promise<void>(resolve => {
          img.onload = () => {
            const x = (j % 3) * 600;
            const y = Math.floor(j / 3) * 600;
            ctx.drawImage(img, x, y, 600, 600);

            const overlayImg = new Image();
            overlayImg.crossOrigin = 'Anonymous';
            overlayImg.src = URL.createObjectURL(mockup.isDark ? darkVariantOverlay! : lightVariantOverlay!);

            overlayImg.onload = () => {
              const overlayWidth = overlayImg.width;
              const overlayHeight = overlayImg.height;

              const boundsWidth = ((overlayCoords.endX - overlayCoords.startX) / 500) * 600;
              const boundsHeight = ((overlayCoords.endY - overlayCoords.startY) / 500) * 600;

              const aspectRatio = overlayWidth / overlayHeight;
              let displayWidth, displayHeight;
              if (boundsWidth / boundsHeight > aspectRatio) {
                displayHeight = boundsHeight;
                displayWidth = boundsHeight * aspectRatio;
              } else {
                displayWidth = boundsWidth;
                displayHeight = boundsWidth / aspectRatio;
              }

              const overlayLeft = (overlayCoords.startX / 500) * 600;
              const overlayTop = (overlayCoords.startY / 500) * 600;

              ctx.drawImage(overlayImg, x + overlayLeft, y + overlayTop, displayWidth, displayHeight);
              resolve();
            };
          };
        });
      }

      const link = document.createElement('a');
      link.download = `mockup_group_${i + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadMockup}
        disabled={!imagesLoaded}
        style={{ marginBottom: '16px' }}
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
