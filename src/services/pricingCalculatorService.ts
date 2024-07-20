export const calculateEtsyPrice = (
    productionCost: number,
    profitPercentage: number,
    runAds: boolean,
    discountPercentage: number
  ): number => {
    const profitMultiplier = 1 + profitPercentage / 100;
    const discountedPrice = productionCost * profitMultiplier / (1 - discountPercentage / 100);
    const etsyFeeMultiplier = 1 + 0.065 + (runAds ? 0.15 : 0);
    return discountedPrice * etsyFeeMultiplier;
  };
  
  export const calculateShopifyPrice = (
    productionCost: number,
    profitPercentage: number,
    discountPercentage: number
  ): number => {
    const profitMultiplier = 1 + profitPercentage / 100;
    return (productionCost * profitMultiplier) / (1 - discountPercentage / 100);
  };
  