import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorVariant } from '../../types';

interface ColorVariantsState {
  colorVariants: ColorVariant[];
}

const initialState: ColorVariantsState = {
  colorVariants: [],
};

const colorVariantsSlice = createSlice({
  name: 'colorVariants',
  initialState,
  reducers: {
    setColorVariants(state, action: PayloadAction<ColorVariant[]>) {
      state.colorVariants = action.payload;
    },
    addColorVariant(state, action: PayloadAction<ColorVariant>) {
      state.colorVariants.push(action.payload);
    },
    updateColorVariant(state, action: PayloadAction<ColorVariant>) {
      const index = state.colorVariants.findIndex(variant => variant.id === action.payload.id);
      if (index !== -1) {
        state.colorVariants[index] = action.payload;
      }
    },
    deleteColorVariant(state, action: PayloadAction<string>) {
      state.colorVariants = state.colorVariants.filter(variant => variant.id !== action.payload);
    },
  },
});

export const { setColorVariants, addColorVariant, updateColorVariant, deleteColorVariant } = colorVariantsSlice.actions;
export default colorVariantsSlice.reducer;
