import { roundTo99Cents } from '../utils/pricingCalculatorUtils';
import { PricingInfo, FeeBreakdown } from '../types';
import {
  ETSY_ADS_MARKUP_PERCENT,
  ETSY_FEE_PERCENT,
  ETSY_PAYMENT_PROCESSING_FEE_PERCENT,
  ETSY_REGULATORY_OPERATING_FEE_PERCENT,
  ETSY_TAX_RATE_PERCENT,
  ETSY_FLAT_FEE,
  ETSY_LISTING_FEE,
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
  const etsyFeeRate = ETSY_FEE_PERCENT;
  const paymentProcessingFeeRate = ETSY_PAYMENT_PROCESSING_FEE_PERCENT;
  const regulatoryOperatingFeeRate = ETSY_REGULATORY_OPERATING_FEE_PERCENT;
  const taxRate = ETSY_TAX_RATE_PERCENT;
  const flatFee = ETSY_FLAT_FEE;
  const listingFee = ETSY_LISTING_FEE;

  const discountMultiplier = 1 - discountPercentage / 100;

  // Step 1: Calculate Subtotal
  const profitAmount = productionCost * (profitPercentage / 100);
  const baseAmount = productionCost + (freeShipping ? shippingCost : 0) + profitAmount;

  // Step 2: First Pass Calculations
  const etsyFees = baseAmount * etsyFeeRate;
  console.log("etsyFees: ", etsyFees);
  const etsyTaxes = etsyFees * taxRate;
  console.log("etsyTaxes: ", etsyTaxes);
  const paymentProcessingFees = baseAmount * paymentProcessingFeeRate;
  console.log("paymentProcessingFees: ", paymentProcessingFees);
  const paymentProcessingTaxes = paymentProcessingFees * taxRate;
  console.log("paymentProcessingTaxes: ", paymentProcessingTaxes);
  const regulatoryOperatingFees = baseAmount * regulatoryOperatingFeeRate;
  console.log("regulatoryOperatingFees: ", regulatoryOperatingFees);
  const regulatoryOperatingTaxes = regulatoryOperatingFees * taxRate;
  console.log("regulatoryOperatingTaxes: ", regulatoryOperatingTaxes);
  const flatFeeTaxes = flatFee * taxRate;
  console.log("flatFeeTaxes: ", flatFeeTaxes);
  const listingFeeTaxes = listingFee * taxRate;
  console.log("listingFeeTaxes: ", listingFeeTaxes);
  const firstPassTotalBaseFees =
    etsyFees + paymentProcessingFees + regulatoryOperatingFees + flatFee + listingFee;
  console.log("firstPassTotalBaseFees: ", firstPassTotalBaseFees);
  const firstPassTotalTaxes =
    etsyTaxes +
    paymentProcessingTaxes +
    regulatoryOperatingTaxes +
    flatFeeTaxes +
    listingFeeTaxes;
  console.log("firstPassTotalTaxes: ", firstPassTotalTaxes);
  const firstPassTotalFees = firstPassTotalBaseFees + firstPassTotalTaxes;
  console.log("firstPassTotalFees: ", firstPassTotalFees);
  const firstPassTotalAmount = productionCost + shippingCost + firstPassTotalFees;
  console.log("firstPassTotalAmount: ", firstPassTotalAmount);

  // Step 3: Second Pass Calculations
  const secondPassBaseAmount = productionCost + shippingCost + profitAmount + firstPassTotalFees;
  console.log("secondPassBaseAmount: ", secondPassBaseAmount);
  const recalculatedEtsyFees = secondPassBaseAmount * etsyFeeRate;
  console.log("2nd pass etsy fees: ", recalculatedEtsyFees);
  const recalculatedEtsyTaxes = recalculatedEtsyFees * taxRate;
  console.log("2nd pass etsy taxes: ", recalculatedEtsyTaxes);
  const recalculatedPaymentProcessingFees = secondPassBaseAmount * paymentProcessingFeeRate;
  console.log("2nd pass payment processing fees: ", recalculatedPaymentProcessingFees);
  const recalculatedPaymentProcessingTaxes = recalculatedPaymentProcessingFees * taxRate;
  console.log("2nd pass payment processing taxes: ", recalculatedPaymentProcessingTaxes);
  const recalculatedRegulatoryOperatingFees = secondPassBaseAmount * regulatoryOperatingFeeRate;
  console.log("2nd pass regulatory operating fees: ", recalculatedRegulatoryOperatingFees);
  const recalculatedRegulatoryOperatingTaxes = recalculatedRegulatoryOperatingFees * taxRate;
  console.log("2nd pass regulatory operating taxes: ", recalculatedRegulatoryOperatingTaxes);
  const secondPassTotalBaseFees =
    recalculatedEtsyFees +
    recalculatedPaymentProcessingFees +
    recalculatedRegulatoryOperatingFees +
    flatFee +
    listingFee;
  console.log("2nd pass total base fees: ", secondPassTotalBaseFees);
  const secondPassTotalTaxes =
    recalculatedEtsyTaxes +
    recalculatedPaymentProcessingTaxes +
    recalculatedRegulatoryOperatingTaxes +
    flatFeeTaxes +
    listingFeeTaxes;
  console.log("2nd pass total taxes: ", secondPassTotalTaxes);
  const secondPassTotalFees = secondPassTotalBaseFees + secondPassTotalTaxes;
  console.log("2nd pass total fees: ", secondPassTotalFees);
  const secondPassTotalAmount = productionCost + shippingCost + secondPassTotalFees;
  console.log("2nd pass total amount: ", secondPassTotalAmount);

  // Step 4: Final Net Cost
  const netCost = productionCost + shippingCost + secondPassTotalFees;

  // Step 5: Final Before-Discount Price
  const finalBeforeDiscount = baseAmount + secondPassTotalFees;

  // Step 6: Apply Rounding
  const roundedDiscountedPrice = roundTo99Cents(finalBeforeDiscount);

  // Update Final Price to Reverse-Engineer Discount
  const finalPriceBeforeDiscount = roundedDiscountedPrice / discountMultiplier;

  // Step 7: Construct Breakdown
  const breakdown: FeeBreakdown = {
    productionCost: productionCost,
    shippingCost: freeShipping ? shippingCost : 0,
    profitAmount: profitAmount,
    firstPass: {
      etsyFees,
      etsyTaxes,
      paymentProcessingFees,
      paymentProcessingTaxes,
      regulatoryOperatingFees,
      regulatoryOperatingTaxes,
      flatFee,
      listingFee,
      totalBaseFees: firstPassTotalBaseFees,
      totalTaxes: firstPassTotalTaxes,
      totalFees: firstPassTotalFees,
      totalAmount: firstPassTotalAmount,
    },
    secondPass: {
      etsyFees: recalculatedEtsyFees,
      etsyTaxes: recalculatedEtsyTaxes,
      paymentProcessingFees: recalculatedPaymentProcessingFees,
      paymentProcessingTaxes: recalculatedPaymentProcessingTaxes,
      regulatoryOperatingFees: recalculatedRegulatoryOperatingFees,
      regulatoryOperatingTaxes: recalculatedRegulatoryOperatingTaxes,
      flatFee,
      listingFee,
      totalBaseFees: secondPassTotalBaseFees,
      totalTaxes: secondPassTotalTaxes,
      totalFees: secondPassTotalFees,
      totalAmount: secondPassTotalAmount,
    },
    netCost: netCost,
  };

  return {
    productionCost,
    profitAmount,
    shippingCost: freeShipping ? shippingCost : 0,
    netCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: roundedDiscountedPrice,
    breakdown,
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
  const listingFee = ETSY_LISTING_FEE;

  const discountMultiplier = 1 - discountPercentage / 100;

  // Step 1: Calculate Subtotal
  const subtotal = productionCost + (freeShipping ? shippingCost : 0);

  // Step 2: Calculate Fees on Subtotal
  const etsyFees = subtotal * etsyFeeRate;
  const etsyTaxes = etsyFees * (taxRate - 1);
  const paymentProcessingFees = subtotal * paymentProcessingFeeRate;
  const paymentProcessingTaxes = paymentProcessingFees * (taxRate - 1);
  const regulatoryOperatingFees = subtotal * regulatoryOperatingFeeRate;
  const regulatoryOperatingTaxes = regulatoryOperatingFees * (taxRate - 1);
  const totalBaseFees = etsyFees + paymentProcessingFees + regulatoryOperatingFees;
  const totalTaxes = etsyTaxes + paymentProcessingTaxes + regulatoryOperatingTaxes;
  const totalFees = totalBaseFees + totalTaxes + flatFee + listingFee;

  // Step 3: Intermediate Total
  const intermediateTotal = subtotal + totalFees;

  // Step 4: Recalculate Fees on Intermediate Total
  const recalculatedEtsyFees = intermediateTotal * etsyFeeRate;
  const recalculatedEtsyTaxes = recalculatedEtsyFees * (taxRate - 1);
  const recalculatedPaymentProcessingFees = intermediateTotal * paymentProcessingFeeRate;
  const recalculatedPaymentProcessingTaxes = recalculatedPaymentProcessingFees * (taxRate - 1);
  const recalculatedRegulatoryOperatingFees = intermediateTotal * regulatoryOperatingFeeRate;
  const recalculatedRegulatoryOperatingTaxes = recalculatedRegulatoryOperatingFees * (taxRate - 1);
  const recalculatedBaseFees =
    recalculatedEtsyFees + recalculatedPaymentProcessingFees + recalculatedRegulatoryOperatingFees;
  const recalculatedTaxes =
    recalculatedEtsyTaxes + recalculatedPaymentProcessingTaxes + recalculatedRegulatoryOperatingTaxes;
  const recalculatedTotalFees =
    recalculatedBaseFees + recalculatedTaxes + flatFee + listingFee;

  // Step 5: Calculate Net Cost
  const netCost =
    productionCost +
    (freeShipping ? shippingCost : 0) +
    recalculatedTotalFees;

  // Step 6: Final Before-Discount Price
  const finalBeforeDiscount = subtotal + recalculatedTotalFees;

  // Step 7: Apply Rounding
  const roundedDiscountedPrice = roundTo99Cents(finalBeforeDiscount);

  // Update Final Price to Reverse-Engineer Discount
  const finalPriceBeforeDiscount = roundedDiscountedPrice / discountMultiplier;

  // Step 8: Construct Breakdown
  const breakdown: FeeBreakdown = {
    productionCost,
    shippingCost: freeShipping ? shippingCost : 0,
    profitAmount: 0,
    firstPass: {
      etsyFees,
      etsyTaxes,
      paymentProcessingFees,
      paymentProcessingTaxes,
      regulatoryOperatingFees,
      regulatoryOperatingTaxes,
      flatFee,
      listingFee,
      totalBaseFees,
      totalTaxes,
      totalFees,
      totalAmount: subtotal + totalFees,
    },
    secondPass: {
      etsyFees: recalculatedEtsyFees,
      etsyTaxes: recalculatedEtsyTaxes,
      paymentProcessingFees: recalculatedPaymentProcessingFees,
      paymentProcessingTaxes: recalculatedPaymentProcessingTaxes,
      regulatoryOperatingFees: recalculatedRegulatoryOperatingFees,
      regulatoryOperatingTaxes: recalculatedRegulatoryOperatingTaxes,
      flatFee,
      listingFee,
      totalBaseFees: recalculatedBaseFees,
      totalTaxes: recalculatedTaxes,
      totalFees: recalculatedTotalFees,
      totalAmount: intermediateTotal + recalculatedTotalFees,
    },
    netCost,
  };

  return {
    productionCost,
    profitAmount: 0,
    shippingCost,
    netCost,
    finalPrice: finalPriceBeforeDiscount,
    afterDiscountPrice: roundedDiscountedPrice,
    breakdown,
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
