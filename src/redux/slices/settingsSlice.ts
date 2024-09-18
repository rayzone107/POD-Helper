import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MockupGrid {
  horizontal: number;
  vertical: number;
}

interface SettingsState {
  defaultProfitPercentage: number;
  defaultEtsySalePercentage: number;
  defaultShopifySalePercentage: number;
  mockupGrid: MockupGrid;
  defaultFreeShippingEtsy: boolean;    // New field
  defaultFreeShippingShopify: boolean; // New field
}

const initialState: SettingsState = {
  defaultProfitPercentage: 0,
  defaultEtsySalePercentage: 0,
  defaultShopifySalePercentage: 0,
  mockupGrid: {
    horizontal: 3,
    vertical: 3,
  },
  defaultFreeShippingEtsy: false,    // New field
  defaultFreeShippingShopify: false, // New field
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SettingsState>) {
      state.defaultProfitPercentage = action.payload.defaultProfitPercentage;
      state.defaultEtsySalePercentage = action.payload.defaultEtsySalePercentage;
      state.defaultShopifySalePercentage = action.payload.defaultShopifySalePercentage;
      state.mockupGrid = action.payload.mockupGrid;
      state.defaultFreeShippingEtsy = action.payload.defaultFreeShippingEtsy;          // New field
      state.defaultFreeShippingShopify = action.payload.defaultFreeShippingShopify;    // New field
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
