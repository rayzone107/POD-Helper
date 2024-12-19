import { Product } from 'shared/types/Product';

export const mapOptions = (product: Product) => {
  const sizeMap: Record<number, string> = {};
  const colorMap: Record<number, { title: string; code: string }> = {};

  product.options.forEach((option) => {
    if (option.type === 'size') {
      option.values.forEach((size) => {
        sizeMap[size.id] = size.title;
      });
    } else if (option.type === 'color') {
      option.values.forEach((color) => {
        colorMap[color.id] = { title: color.title, code: color.colors?.[0] || '#ccc' };
      });
    }
  });

  return { sizeMap, colorMap };
};
