import { roundTo99Cents } from '../utils/pricingCalculatorUtils';
import { PricingInfo } from '../types';
import { log } from 'console';

export const calculateEtsyPrice = (
  productionCost: number,
  profitPercentage: number,
  discountPercentage: number,
  runAds: boolean,
  freeShipping: boolean,
  shippingCost: number = 0
): PricingInfo => {
  const adsMarkup = runAds ? 0.15 : 0;
  const etsyFee = 0.065;
  const paymentProcessingFee = 0.03;
  const flatFee = 0.25;
  const discountMultiplier = 1 - discountPercentage / 100;

  const profitAmount = productionCost * (profitPercentage / 100);
  const basePrice = productionCost + profitAmount;
  const totalFees = (basePrice * (adsMarkup + etsyFee + paymentProcessingFee)) + flatFee;
  let finalPriceBeforeShipping = basePrice + totalFees;

  const finalPriceWithShipping = freeShipping ? finalPriceBeforeShipping + shippingCost : finalPriceBeforeShipping;
  const finalPriceRounded = roundTo99Cents(finalPriceWithShipping);
  const finalPriceBeforeDiscount = finalPriceRounded / discountMultiplier;

  return {
    productionCost,
    profitAmount,
    profitPercentage,
    shippingCost: freeShipping ? shippingCost : 0,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: finalPriceRounded
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
    profitPercentage,
    shippingCost: freeShipping ? shippingCost : 0,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: finalPriceRounded
  };
};

export const calculateEtsyPriceWithoutProfit = (
  productionCost: number,
  discountPercentage: number,
  runAds: boolean,
  shippingCost: number = 0
): PricingInfo => {
  const adsMarkup = runAds ? 0.15 : 0;
  const etsyFee = 0.065;
  const paymentProcessingFee = 0.03;
  const flatFee = 0.25;

  // Base price includes production and shipping cost
  const basePrice = productionCost + shippingCost;

  // Calculate total fees on base price (no profit added)
  const totalFees = (basePrice * (adsMarkup + etsyFee + paymentProcessingFee)) + flatFee;

  // Final price after all costs but without profit (this is the discounted price)
  const afterDiscountPrice = basePrice + totalFees;

  // Reverse-engineer to find the pre-discounted final price
  const discountMultiplier = 1 - discountPercentage / 100;
  const finalPriceBeforeDiscount = afterDiscountPrice / discountMultiplier;

  return {
    productionCost,
    profitAmount: 0,
    profitPercentage: 0,
    shippingCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice,
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
    profitPercentage: 0,
    shippingCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice,
  };
};
