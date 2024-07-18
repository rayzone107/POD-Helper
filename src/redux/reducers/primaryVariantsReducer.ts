import { createReducer } from '@reduxjs/toolkit';
import { setPrimaryLightVariant, setPrimaryDarkVariant } from '../slices/primaryVariantsSlice';

interface PrimaryVariantsState {
  primaryLightVariant: string;
  primaryDarkVariant: string;
}

const initialState: PrimaryVariantsState = {
  primaryLightVariant: '',
  primaryDarkVariant: '',
};

const primaryVariantsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setPrimaryLightVariant, (state, action) => {
      state.primaryLightVariant = action.payload;
    })
    .addCase(setPrimaryDarkVariant, (state, action) => {
      state.primaryDarkVariant = action.payload;
    });
});

export default primaryVariantsReducer;
