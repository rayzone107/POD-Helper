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
}

const initialState: SettingsState = {
  defaultProfitPercentage: 0,
  defaultEtsySalePercentage: 0,
  defaultShopifySalePercentage: 0,
  mockupGrid: {
    horizontal: 3,
    vertical: 3,
  },
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
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
