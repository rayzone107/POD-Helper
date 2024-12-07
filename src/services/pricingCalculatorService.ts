import { roundTo99Cents } from '../utils/pricingCalculatorUtils';
import { PricingInfo } from '../types';
import { ETSY_ADS_MARKUP_PERCENT, ETSY_FEE_PERCENT, ETSY_FLAT_FEE, ETSY_PAYMENT_PROCESSING_FEE_PERCENT, ETSY_REGULATORY_OPERATING_FEE_PERCENT, ETSY_TAX_RATE_PERCENT } from '../utils/constants';

export const calculateEtsyPrice = (
  productionCost: number,
  profitPercentage: number,
  discountPercentage: number,
  runAds: boolean,
  freeShipping: boolean,
  shippingCost: number = 0
): PricingInfo => {
  const adsMarkup = runAds ? ETSY_ADS_MARKUP_PERCENT : 0;
  const etsyFeeRate = ETSY_FEE_PERCENT;
  const paymentProcessingFeeRate = ETSY_PAYMENT_PROCESSING_FEE_PERCENT;
  const regulatoryOperatingFeeRate = ETSY_REGULATORY_OPERATING_FEE_PERCENT;
  const taxRate = ETSY_TAX_RATE_PERCENT;
  const flatFee = ETSY_FLAT_FEE;

  const discountMultiplier = 1 - discountPercentage / 100;

  // Step 1: Calculate Subtotal
  const profitAmount = productionCost * (profitPercentage / 100);
  console.log("profitAmount: ", profitAmount);
  const subtotal = productionCost + profitAmount + (freeShipping ? shippingCost : 0);
  console.log("subtotal: ", subtotal);

  // Step 2: Calculate Fees on Subtotal
  const baseFees = subtotal * (adsMarkup + etsyFeeRate + paymentProcessingFeeRate + regulatoryOperatingFeeRate);
  console.log("baseFees: ", baseFees);
  const hstOnFees = baseFees * (taxRate - 1); // Only the tax part
  console.log("hstOnFees: ", hstOnFees);
  const totalFees = baseFees + hstOnFees + flatFee;
  console.log("totalFees: ", totalFees);

  // Step 3: Intermediate Total
  const intermediateTotal = subtotal + totalFees;
  console.log("intermediateTotal: ", intermediateTotal);

  // Step 4: Recalculate Fees on Intermediate Total
  const recalculatedBaseFees = intermediateTotal * (adsMarkup + etsyFeeRate + paymentProcessingFeeRate + regulatoryOperatingFeeRate);
  console.log("recalculatedBaseFees: ", recalculatedBaseFees);
  const recalculatedHSTOnFees = recalculatedBaseFees * (taxRate - 1); // Only the tax part
  console.log("recalculatedHSTOnFees: ", recalculatedHSTOnFees);
  const recalculatedTotalFees = recalculatedBaseFees + recalculatedHSTOnFees + flatFee;
  console.log("recalculatedTotalFees: ", recalculatedTotalFees);

  // Step 5: Calculate Net Cost
  const netCost = productionCost + (freeShipping ? shippingCost : 0) + recalculatedTotalFees;
  console.log("netCost: ", netCost);

  // Step 6: Final Before-Discount Price
  const finalBeforeDiscount = subtotal + recalculatedTotalFees;
  console.log("finalBeforeDiscount: ", finalBeforeDiscount);

  // Step 7: Apply Rounding
  const roundedDiscountedPrice = roundTo99Cents(finalBeforeDiscount);
  console.log("roundedDiscountedPrice: ", roundedDiscountedPrice);

  // Update Final Price to Reverse-Engineer Discount
  const finalPriceBeforeDiscount = roundedDiscountedPrice / discountMultiplier;
  console.log("finalPriceBeforeDiscount: ", finalPriceBeforeDiscount);

  return {
    productionCost,
    profitAmount,
    shippingCost: freeShipping ? shippingCost : 0,
    netCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: roundedDiscountedPrice,
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
  const etsyFeeRate = ETSY_FEE_PERCENT;
  const paymentProcessingFeeRate = ETSY_PAYMENT_PROCESSING_FEE_PERCENT;
  const regulatoryOperatingFeeRate = ETSY_REGULATORY_OPERATING_FEE_PERCENT;
  const taxRate = ETSY_TAX_RATE_PERCENT;
  const flatFee = ETSY_FLAT_FEE;

  const discountMultiplier = 1 - discountPercentage / 100;

  // Step 1: Calculate Subtotal
  const subtotal = productionCost + (freeShipping ? shippingCost : 0);

  // Step 2: Calculate Fees on Subtotal
  const baseFees = subtotal * (adsMarkup + etsyFeeRate + paymentProcessingFeeRate + regulatoryOperatingFeeRate);
  const hstOnFees = baseFees * (taxRate - 1); // Only the tax part
  const totalFees = baseFees + hstOnFees + flatFee;

  // Step 3: Intermediate Total
  const intermediateTotal = subtotal + totalFees;

  // Step 4: Recalculate Fees on Intermediate Total
  const recalculatedBaseFees = intermediateTotal * (adsMarkup + etsyFeeRate + paymentProcessingFeeRate + regulatoryOperatingFeeRate);
  const recalculatedHSTOnFees = recalculatedBaseFees * (taxRate - 1); // Only the tax part
  const recalculatedTotalFees = recalculatedBaseFees + recalculatedHSTOnFees + flatFee;

  // Step 5: Calculate Net Cost
  const netCost = productionCost + (freeShipping ? shippingCost : 0) + recalculatedTotalFees;
  console.log("netCost: ", netCost);

  // Step 6: Final Before-Discount Price
  const finalBeforeDiscount = subtotal + recalculatedTotalFees;

  // Step 7: Apply Rounding
  const roundedDiscountedPrice = roundTo99Cents(finalBeforeDiscount);

  // Update Final Price to Reverse-Engineer Discount
  const finalPriceBeforeDiscount = roundedDiscountedPrice / discountMultiplier;

  return {
    productionCost,
    profitAmount: 0,
    shippingCost,
    netCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: roundedDiscountedPrice,
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
