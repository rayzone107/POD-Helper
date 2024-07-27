// src/redux/slices/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  defaultProfitPercentage: number;
  defaultEtsySalePercentage: number;
  defaultShopifySalePercentage: number;
}

const initialState: SettingsState = {
  defaultProfitPercentage: 0,
  defaultEtsySalePercentage: 0,
  defaultShopifySalePercentage: 0,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SettingsState>) {
      state.defaultProfitPercentage = action.payload.defaultProfitPercentage;
      state.defaultEtsySalePercentage = action.payload.defaultEtsySalePercentage;
      state.defaultShopifySalePercentage = action.payload.defaultShopifySalePercentage;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
