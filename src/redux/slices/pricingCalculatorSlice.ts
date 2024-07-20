import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Type } from '../../types';

interface PricingInfo {
  productionCost: number;
  profitAmount: number;
  profitPercentage: number;
  finalPrice: number;
  finalPriceRounded: number;
}

interface PricingCalculatorState {
  selectedCategory: string;
  selectedBrand: string;
  selectedType: Type | null;
  profitPercentage: number;
  runAdsOnEtsy: boolean;
  discountPercentageEtsy: number;
  discountPercentageShopify: number;
  etsyPrices: Record<string, PricingInfo>;
  shopifyPrices: Record<string, PricingInfo>;
}

const initialState: PricingCalculatorState = {
  selectedCategory: '',
  selectedBrand: '',
  selectedType: null,
  profitPercentage: 0,
  runAdsOnEtsy: false,
  discountPercentageEtsy: 0,
  discountPercentageShopify: 0,
  etsyPrices: {},
  shopifyPrices: {},
};

const pricingCalculatorSlice = createSlice({
  name: 'pricingCalculator',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand(state, action: PayloadAction<string>) {
      state.selectedBrand = action.payload;
    },
    setSelectedType(state, action: PayloadAction<Type | null>) {
      state.selectedType = action.payload;
    },
    setProfitPercentage(state, action: PayloadAction<number>) {
      state.profitPercentage = action.payload;
    },
    setRunAdsOnEtsy(state, action: PayloadAction<boolean>) {
      state.runAdsOnEtsy = action.payload;
    },
    setDiscountPercentageEtsy(state, action: PayloadAction<number>) {
      state.discountPercentageEtsy = action.payload;
    },
    setDiscountPercentageShopify(state, action: PayloadAction<number>) {
      state.discountPercentageShopify = action.payload;
    },
    setEtsyPrices(state, action: PayloadAction<Record<string, PricingInfo>>) {
      state.etsyPrices = action.payload;
    },
    setShopifyPrices(state, action: PayloadAction<Record<string, PricingInfo>>) {
      state.shopifyPrices = action.payload;
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedBrand,
  setSelectedType,
  setProfitPercentage,
  setRunAdsOnEtsy,
  setDiscountPercentageEtsy,
  setDiscountPercentageShopify,
  setEtsyPrices,
  setShopifyPrices,
} = pricingCalculatorSlice.actions;

export default pricingCalculatorSlice.reducer;
