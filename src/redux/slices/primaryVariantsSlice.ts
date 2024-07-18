import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PrimaryVariantsState {
  primaryLightVariant: string;
  primaryDarkVariant: string;
}

const initialState: PrimaryVariantsState = {
  primaryLightVariant: '',
  primaryDarkVariant: '',
};

const primaryVariantsSlice = createSlice({
  name: 'primaryVariants',
  initialState,
  reducers: {
    setPrimaryLightVariant(state, action: PayloadAction<string>) {
      state.primaryLightVariant = action.payload;
    },
    setPrimaryDarkVariant(state, action: PayloadAction<string>) {
      state.primaryDarkVariant = action.payload;
    },
  },
});

export const { setPrimaryLightVariant, setPrimaryDarkVariant } = primaryVariantsSlice.actions;
export default primaryVariantsSlice.reducer;
