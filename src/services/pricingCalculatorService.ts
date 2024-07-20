import { roundTo99Cents } from '../utils/pricingCalculatorUtils';
import { PricingInfo } from '../types';

export const calculateEtsyPrice = (
  productionCost: number,
  profitPercentage: number,
  discountPercentage: number,
  runAds: boolean
): PricingInfo => {
  const adsMarkup = runAds ? 0.15 : 0;
  const etsyFee = 0.065;
  const profitAmount = productionCost * (profitPercentage / 100);
  const discountMultiplier = 1 - discountPercentage / 100;
  const basePrice = productionCost + profitAmount;
  const finalPrice = basePrice / discountMultiplier;
  const totalFees = finalPrice * (adsMarkup + etsyFee);
  const finalPriceAfterFees = finalPrice + totalFees;
  const finalPriceRounded = roundTo99Cents(finalPriceAfterFees);

  return {
    productionCost,
    profitAmount,
    profitPercentage,
    finalPrice: finalPriceAfterFees,
    finalPriceRounded,
  };
};

export const calculateShopifyPrice = (
  productionCost: number,
  profitPercentage: number,
  discountPercentage: number
): PricingInfo => {
  const profitAmount = productionCost * (profitPercentage / 100);
  const discountMultiplier = 1 - discountPercentage / 100;
  const basePrice = productionCost + profitAmount;
  const finalPrice = basePrice / discountMultiplier;
  const finalPriceRounded = roundTo99Cents(finalPrice);

  return {
    productionCost,
    profitAmount,
    profitPercentage,
    finalPrice,
    finalPriceRounded,
  };
};
