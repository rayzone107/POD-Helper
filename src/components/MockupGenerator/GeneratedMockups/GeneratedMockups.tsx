import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, Slider } from '@mui/material';
import { RootState } from '../../../redux/store';
import { fetchSettings, AppSettings } from '../../../services/settingsService';
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

  const [gridSize, setGridSize] = useState({ horizontal: 3, vertical: 3 });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const settings: AppSettings = await fetchSettings();
        setGridSize({
          horizontal: settings.mockupGrid.horizontal,
          vertical: settings.mockupGrid.vertical,
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchInitialData();
  }, []);

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
    const totalGroups = Math.ceil(mockupImages.length / (gridSize.horizontal * gridSize.vertical));
  
    for (let i = 0; i < totalGroups; i++) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const group = mockupImages.slice(i * gridSize.horizontal * gridSize.vertical, (i + 1) * gridSize.horizontal * gridSize.vertical);
      const numCols = Math.min(gridSize.horizontal, group.length);
      const numRows = Math.ceil(group.length / gridSize.horizontal);
  
      canvas.width = numCols * 600;
      canvas.height = numRows * 650;
  
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      for (let j = 0; j < group.length; j++) {
        const mockup = group[j];
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = mockup.imageUrl;
  
        // Wait for the main image to load and draw it
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Calculate position for each image
            const x = (j % gridSize.horizontal) * 600;
            const y = Math.floor(j / gridSize.horizontal) * 650;
  
            // Check if we are on the last row and if it has fewer items than the full row width
            const isLastRow = Math.floor(j / gridSize.horizontal) === numRows - 1;
            const itemsInLastRow = group.length % gridSize.horizontal || gridSize.horizontal;
            let offsetX = 0;
  
            // Calculate horizontal offset for centering last row if needed
            if (isLastRow && itemsInLastRow < gridSize.horizontal) {
              offsetX = ((gridSize.horizontal - itemsInLastRow) * 600) / 2; // Center the row
            }
  
            // Draw the main image and overlay if applicable
            ctx.drawImage(img, x + offsetX, y, 600, 600);
  
            if (lightVariantOverlay || darkVariantOverlay) {
              const overlayFile = mockup.isDark ? darkVariantOverlay : lightVariantOverlay;
  
              if (overlayFile) {
                const overlayImg = new Image();
                overlayImg.crossOrigin = 'Anonymous';
                overlayImg.src = URL.createObjectURL(overlayFile);
  
                // Wait for the overlay to load and draw it
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
  
                  ctx.drawImage(overlayImg, x + overlayLeft + offsetX, y + overlayTop, displayWidth, displayHeight);
                  URL.revokeObjectURL(overlayImg.src); // Clean up the object URL
                  resolve(); // Complete the overlay drawing
                };
  
                overlayImg.onerror = () => {
                  console.error('Failed to load overlay image');
                  resolve(); // Resolve to ensure the loop continues
                };
              } else {
                resolve(); // No overlay file, resolve immediately
              }
            } else {
              resolve(); // No overlays, resolve immediately
            }
  
            ctx.fillStyle = '#000000';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(mockup.name, x + offsetX + 300, y + 630);
          };
  
          img.onerror = () => {
            console.error('Failed to load main image');
            resolve(); // Resolve to ensure the loop continues
          };
        });
      }
  
      // Save the current canvas to a file
      const link = document.createElement('a');
      link.download = `mockup_group_${i + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };  

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Grid Size
      </Typography>
      <Typography gutterBottom>Horizontal</Typography>
      <Slider
        value={gridSize.horizontal}
        onChange={(e, value) => setGridSize({ ...gridSize, horizontal: value as number })}
        aria-labelledby="horizontal-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={2}
        max={5}
      />
      <Typography gutterBottom>Vertical</Typography>
      <Slider
        value={gridSize.vertical}
        onChange={(e, value) => setGridSize({ ...gridSize, vertical: value as number })}
        aria-labelledby="vertical-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={2}
        max={5}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadMockup}
        disabled={!imagesLoaded}
        style={{ marginBottom: '16px' }}
      >
        Download Mockup Images
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
              {lightVariantOverlay || darkVariantOverlay ? (
                <img
                  src={URL.createObjectURL(mockup.isDark ? (darkVariantOverlay || lightVariantOverlay!) : lightVariantOverlay!)}
                  alt="Overlay"
                  className="overlay-image"
                  style={{
                    left: `${(overlayCoords.startX / 500) * mockup.width}px`,
                    top: `${(overlayCoords.startY / 500) * mockup.height}px`,
                    width: `${((overlayCoords.endX - overlayCoords.startX) / 500) * mockup.width}px`,
                    height: `${((overlayCoords.endY - overlayCoords.startY) / 500) * mockup.height}px`,
                  }}
                />
              ) : null}
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
