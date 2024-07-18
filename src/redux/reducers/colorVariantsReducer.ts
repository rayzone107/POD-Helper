import { createReducer } from '@reduxjs/toolkit';
import { setColorVariants, addColorVariant, updateColorVariant, deleteColorVariant } from '../slices/colorVariantsSlice';
import { ColorVariant } from '../../types';

interface ColorVariantsState {
  colorVariants: ColorVariant[];
}

const initialState: ColorVariantsState = {
  colorVariants: [],
};

const colorVariantsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setColorVariants, (state, action) => {
      state.colorVariants = action.payload;
    })
    .addCase(addColorVariant, (state, action) => {
      state.colorVariants.push(action.payload);
    })
    .addCase(updateColorVariant, (state, action) => {
      const index = state.colorVariants.findIndex(variant => variant.id === action.payload.id);
      if (index !== -1) {
        state.colorVariants[index] = action.payload;
      }
    })
    .addCase(deleteColorVariant, (state, action) => {
      state.colorVariants = state.colorVariants.filter(variant => variant.id !== action.payload);
    });
});

export default colorVariantsReducer;
