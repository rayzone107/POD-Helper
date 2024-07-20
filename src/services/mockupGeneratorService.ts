import { Type } from '../types';
import { saveAs } from 'file-saver';
import { createCanvas, loadImage } from 'canvas';
import { arrayBufferToBlob } from 'blob-util';

export const generateMockups = async (
  type: Type,
  selectedColorVariants: string[],
  lightVariantOverlay: File,
  darkVariantOverlay: File,
  overlayPosition: { x: number; y: number; width: number; height: number }
) => {
  const promises = type.colorVariants
    .filter((variant) => selectedColorVariants.includes(variant.id))
    .map(async (variant) => {
      const isDark = variant.isDark;
      const overlayImage = isDark ? darkVariantOverlay : lightVariantOverlay;
      const primaryVariantImage = isDark ? type.primaryDarkVariant : type.primaryLightVariant;

      const canvas = createCanvas(600, 600);
      const ctx = canvas.getContext('2d');

      try {
        const primaryImage = await loadImage(primaryVariantImage);
        ctx.drawImage(primaryImage, 0, 0, 600, 600);
      } catch (error) {
        console.error(`Failed to load the primary variant image for ${variant.name}`, error);
        throw error;
      }

      try {
        const overlayUrl = URL.createObjectURL(overlayImage);
        const overlay = await loadImage(overlayUrl);
        ctx.drawImage(
          overlay,
          overlayPosition.x * 6,
          overlayPosition.y * 6,
          overlayPosition.width * 6,
          overlayPosition.height * 6
        );
        URL.revokeObjectURL(overlayUrl); // Clean up the object URL
      } catch (error) {
        console.error(`Failed to load the overlay image for ${variant.name}`, error);
        throw error;
      }

      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(variant.name, 10, 590);

      return {
        name: variant.name,
        dataUrl: canvas.toDataURL(),
      };
    });

  const images = await Promise.all(promises);

  for (let i = 0; i < images.length; i += 9) {
    const canvas = createCanvas(2000, 2000);
    const ctx = canvas.getContext('2d');
    const subImages = images.slice(i, i + 9);

    for (let j = 0; j < subImages.length; j++) {
      const image = await loadImage(subImages[j].dataUrl);
      const x = (j % 3) * 666;
      const y = Math.floor(j / 3) * 666;

      ctx.drawImage(image, x, y, 600, 600);
    }

    const buffer = canvas.toBuffer('image/png');
    const blob = arrayBufferToBlob(buffer, 'image/png');
    saveAs(blob, `mockups_${i / 9 + 1}.png`);
  }
};
