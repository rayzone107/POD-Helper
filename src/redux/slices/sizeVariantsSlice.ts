import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SizeVariant } from '../../types';

interface SizeVariantsState {
  sizeVariants: SizeVariant[];
}

const initialState: SizeVariantsState = {
  sizeVariants: [],
};

const sizeVariantsSlice = createSlice({
  name: 'sizeVariants',
  initialState,
  reducers: {
    setSizeVariants(state, action: PayloadAction<SizeVariant[]>) {
      state.sizeVariants = action.payload;
    },
    addSizeVariant(state, action: PayloadAction<SizeVariant>) {
      state.sizeVariants.push(action.payload);
    },
    updateSizeVariant(state, action: PayloadAction<SizeVariant>) {
      const index = state.sizeVariants.findIndex(variant => variant.id === action.payload.id);
      if (index !== -1) {
        state.sizeVariants[index] = action.payload;
      }
    },
    deleteSizeVariant(state, action: PayloadAction<string>) {
      state.sizeVariants = state.sizeVariants.filter(variant => variant.id !== action.payload);
    },
  },
});

export const { setSizeVariants, addSizeVariant, updateSizeVariant, deleteSizeVariant } = sizeVariantsSlice.actions;
export default sizeVariantsSlice.reducer;
