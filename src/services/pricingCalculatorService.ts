import { roundTo99Cents } from '../utils/pricingCalculatorUtils';
import { PricingInfo, FeeBreakdown } from '../types';
import {
  ETSY_FINAL_FEE_PERCENT,
  ETSY_FINAL_FLAT_FEE,
  ETSY_ADS_MARKUP_PERCENT,
} from '../utils/constants';

export const calculateEtsyPrice = (
  productionCost: number,
  profitPercentage: number,
  discountPercentage: number,
  runAds: boolean,
  freeShipping: boolean,
  shippingCost: number = 0
): PricingInfo => {
  const adsMarkup = runAds ? ETSY_ADS_MARKUP_PERCENT : 0;
  const discountMultiplier = 1 - discountPercentage / 100;

  // Step 1: Calculate Profit Amount
  const profitAmount = productionCost * (profitPercentage / 100);

  // Step 2: Base Amount (Production Cost + Shipping Cost + Profit)
  const baseAmount = productionCost + (freeShipping ? shippingCost : 0) + profitAmount;

  // Step 3: Total Etsy Fees
  const etsyFees = baseAmount * (ETSY_FINAL_FEE_PERCENT + adsMarkup) + ETSY_FINAL_FLAT_FEE;

  // Step 4: Net Cost (Production Cost + Shipping Cost + Etsy Fees)
  const netCost = productionCost + (freeShipping ? shippingCost : 0) + etsyFees;

  // Step 5: Final Before-Discount Price
  const finalBeforeDiscount = baseAmount + etsyFees;

  // Step 6: Apply Rounding
  const roundedDiscountedPrice = roundTo99Cents(finalBeforeDiscount);

  // Step 7: Reverse Engineer Discount
  const finalPriceBeforeDiscount = roundedDiscountedPrice / discountMultiplier;

  return {
    productionCost,
    profitAmount,
    shippingCost: freeShipping ? shippingCost : 0,
    netCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: roundedDiscountedPrice,
    breakdown: null, // No breakdown needed
  };
};


export const calculateEtsyPriceWithoutProfit = (
  productionCost: number,
  discountPercentage: number,
  runAds: boolean,
  freeShipping: boolean,
  shippingCost: number = 0
): PricingInfo => {
  const adsMarkup = runAds ? ETSY_ADS_MARKUP_PERCENT : 0;
  const discountMultiplier = 1 - discountPercentage / 100;

  // Base Amount (Production Cost + Shipping Cost)
  const baseAmount = productionCost + (freeShipping ? shippingCost : 0);

  // Total Etsy Fees
  const etsyFees = baseAmount * (ETSY_FINAL_FEE_PERCENT + adsMarkup) + ETSY_FINAL_FLAT_FEE;

  // Net Cost (Production Cost + Shipping Cost + Etsy Fees)
  const netCost = productionCost + (freeShipping ? shippingCost : 0) + etsyFees;

  // Final Before-Discount Price
  const finalBeforeDiscount = baseAmount + etsyFees;

  // Apply Rounding
  const roundedDiscountedPrice = roundTo99Cents(finalBeforeDiscount);

  // Reverse Engineer Discount
  const finalPriceBeforeDiscount = roundedDiscountedPrice / discountMultiplier;

  return {
    productionCost,
    profitAmount: 0, // No profit in this case
    shippingCost: freeShipping ? shippingCost : 0,
    netCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: roundedDiscountedPrice,
    breakdown: null, // No breakdown needed
  };
};

export const calculateShopifyPrice = (
  productionCost: number,
  profitPercentage: number,
  discountPercentage: number,
  freeShipping: boolean,
  shippingCost: number = 0
): PricingInfo => {
  const discountMultiplier = 1 - discountPercentage / 100;

  const profitAmount = productionCost * (profitPercentage / 100);
  const basePrice = productionCost + profitAmount;

  let finalPriceBeforeShipping = basePrice;

  const finalPriceWithShipping = freeShipping ? finalPriceBeforeShipping + shippingCost : finalPriceBeforeShipping;
  const finalPriceRounded = roundTo99Cents(finalPriceWithShipping);
  const finalPriceBeforeDiscount = finalPriceRounded / discountMultiplier;

  return {
    productionCost,
    profitAmount,
    shippingCost: freeShipping ? shippingCost : 0,
    netCost: 0,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: finalPriceRounded
  };
};

export const calculateShopifyPriceWithoutProfit = (
  productionCost: number,
  discountPercentage: number,
  shippingCost: number = 0
): PricingInfo => {
  // Base price includes production and shipping cost
  const basePrice = productionCost + shippingCost;

  // Discounted price is the total cost after discount (basePrice)
  const discountMultiplier = 1 - discountPercentage / 100;
  const finalPriceBeforeDiscount = basePrice / discountMultiplier;
  const afterDiscountPrice = basePrice;

  return {
    productionCost,
    profitAmount: 0,
    shippingCost,
    netCost: 0,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice,
  };
};
