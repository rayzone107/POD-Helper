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
  shippingCost: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  hexColorCode: string;
  imageUrl?: string;
  imageFile?: File | null;
  isDark: boolean;
}

export interface FeePassDetails {
  etsyFees: number;
  etsyTaxes: number;
  paymentProcessingFees: number;
  paymentProcessingTaxes: number;
  regulatoryOperatingFees: number;
  regulatoryOperatingTaxes: number;
  flatFee: number;
  listingFee: number;
  totalBaseFees: number;
  totalTaxes: number;
  totalFees: number;
  totalAmount: number;
}

// Represents a detailed fee breakdown
export interface FeeBreakdown {
  productionCost: number;
  shippingCost: number;
  profitAmount: number;
  firstPass: FeePassDetails;
  secondPass: FeePassDetails;
  netCost: number; // Final net cost after two passes
}

export interface PricingInfo {
  productionCost: number;
  profitAmount: number;
  shippingCost: number;
  netCost: number;
  finalPrice: number;
  afterDiscountPrice: number;
  breakdown?: FeeBreakdown | null; // Nullable for Shopify or other cases
}
