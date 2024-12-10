export const APP_PADDING = '30px';

export const ETSY_LISTING_FEE = 0.20;
export const ETSY_FEE_PERCENT = 0.065;
export const ETSY_PAYMENT_PROCESSING_FEE_PERCENT = 0.04;
export const ETSY_REGULATORY_OPERATING_FEE_PERCENT = 0.0115;
export const ETSY_ADS_MARKUP_PERCENT = 0.15;
export const ETSY_TAX_RATE_PERCENT = 0.13;
export const ETSY_FLAT_FEE = 0.25;

// This fee is calculated by recursively applying the combined Etsy Fee of 13.16% to itself.
// The 13.16% is the sum of (6.5 + 4 + 1.15) with a 13% tax on it.
export const ETSY_FINAL_FEE_PERCENT = 0.1516; 
// This flat fee is the sum of (0.20 + 0.25) with a 13% tax on it.
export const ETSY_FINAL_FLAT_FEE = 0.5085;