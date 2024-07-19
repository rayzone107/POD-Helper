export interface Category {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
  categoryId: string;
}

export interface Type {
  id: string;
  name: string;
  categoryId: string;
  brandId: string;
  colorVariants: ColorVariant[];
  sizeVariants: SizeVariant[];
  primaryLightVariant: string;
  primaryDarkVariant: string;
  boundingOverlayBoxDimensions: {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
  };
}

export interface SizeVariant {
  id: string;
  name: string;
  price: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  hexColorCode: string;
  imageUrl?: string;
  imageFile?: File | null;
}