import { roundTo99Cents } from '../utils/pricingCalculatorUtils';
import { PricingInfo } from '../types';

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
    shippingCost: 0,
    finalPrice: finalPriceAfterFees,
    afterDiscountPrice: afterDiscountPrice,
  };
};

export const calculateShopifyPriceWithoutProfit = (
  productionCost: number,
  discountPercentage: number,
): PricingInfo => {
  const discountMultiplier = 1 - discountPercentage / 100;
  const finalPrice = productionCost / discountMultiplier;
  const afterDiscountPrice = finalPrice * discountMultiplier;

  return {
    productionCost,
    profitAmount: 0,
    profitPercentage: 0,
    shippingCost: 0,
    finalPrice,
    afterDiscountPrice: afterDiscountPrice,
  };
};
