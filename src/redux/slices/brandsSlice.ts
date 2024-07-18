import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Brand } from '../../types';

interface BrandsState {
  brands: Brand[];
}

const initialState: BrandsState = {
  brands: [],
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands(state, action: PayloadAction<Brand[]>) {
      state.brands = action.payload;
    },
    addBrand(state, action: PayloadAction<Brand>) {
      state.brands.push(action.payload);
    },
    updateBrand(state, action: PayloadAction<Brand>) {
      const index = state.brands.findIndex(brand => brand.id === action.payload.id);
      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    deleteBrand(state, action: PayloadAction<string>) {
      state.brands = state.brands.filter(brand => brand.id !== action.payload);
    },
  },
});

export const { setBrands, addBrand, updateBrand, deleteBrand } = brandsSlice.actions;
export default brandsSlice.reducer;
