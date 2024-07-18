import { createReducer } from '@reduxjs/toolkit';
import { setSizeVariants, addSizeVariant, updateSizeVariant, deleteSizeVariant } from '../slices/sizeVariantsSlice';
import { SizeVariant } from '../../types';

interface SizeVariantsState {
  sizeVariants: SizeVariant[];
}

const initialState: SizeVariantsState = {
  sizeVariants: [],
};

const sizeVariantsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setSizeVariants, (state, action) => {
      state.sizeVariants = action.payload;
    })
    .addCase(addSizeVariant, (state, action) => {
      state.sizeVariants.push(action.payload);
    })
    .addCase(updateSizeVariant, (state, action) => {
      const index = state.sizeVariants.findIndex(variant => variant.id === action.payload.id);
      if (index !== -1) {
        state.sizeVariants[index] = action.payload;
      }
    })
    .addCase(deleteSizeVariant, (state, action) => {
      state.sizeVariants = state.sizeVariants.filter(variant => variant.id !== action.payload);
    });
});

export default sizeVariantsReducer;
