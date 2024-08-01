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
  const paymentProcessingFee = 0.03;
  const flatFee = 0.25;
  const profitAmount = productionCost * (profitPercentage / 100);
  const discountMultiplier = 1 - discountPercentage / 100;
  const basePrice = productionCost + profitAmount;
  const finalPrice = basePrice / discountMultiplier;
  const totalFees = (finalPrice * (adsMarkup + etsyFee + paymentProcessingFee)) + flatFee;
  const finalPriceAfterFees = finalPrice + totalFees;
  const finalPriceRounded = roundTo99Cents(finalPriceAfterFees);
  const afterDiscountPrice = finalPriceRounded * discountMultiplier;

  return {
    productionCost,
    profitAmount,
    profitPercentage,
    finalPrice: finalPriceAfterFees,
    finalPriceRounded,
    afterDiscountPrice
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
  const afterDiscountPrice = finalPriceRounded * discountMultiplier;

  return {
    productionCost,
    profitAmount,
    profitPercentage,
    finalPrice,
    finalPriceRounded,
    afterDiscountPrice
  };
};

export const calculateEtsyPriceWithoutProfit = (
  productionCost: number,
  discountPercentage: number,
  runAds: boolean
): PricingInfo => {
  const adsMarkup = runAds ? 0.15 : 0;
  const etsyFee = 0.065;
  const paymentProcessingFee = 0.03;
  const flatFee = 0.25;
  const discountMultiplier = 1 - discountPercentage / 100;
  const finalPrice = productionCost / discountMultiplier;
  const totalFees = (finalPrice * (adsMarkup + etsyFee + paymentProcessingFee)) + flatFee;
  const finalPriceAfterFees = finalPrice + totalFees;
  const afterDiscountPrice = finalPriceAfterFees * discountMultiplier;

  return {
    productionCost,
    profitAmount: 0,
    profitPercentage: 0,
    finalPrice: finalPriceAfterFees,
    finalPriceRounded: finalPriceAfterFees,
    afterDiscountPrice: afterDiscountPrice,
  };
};

export const calculateShopifyPriceWithoutProfit = (
  productionCost: number,
  discountPercentage: number
): PricingInfo => {
  const discountMultiplier = 1 - discountPercentage / 100;
  const finalPrice = productionCost / discountMultiplier;
  const afterDiscountPrice = finalPrice * discountMultiplier;

  return {
    productionCost,
    profitAmount: 0,
    profitPercentage: 0,
    finalPrice,
    finalPriceRounded: finalPrice,
    afterDiscountPrice: afterDiscountPrice,
  };
};
