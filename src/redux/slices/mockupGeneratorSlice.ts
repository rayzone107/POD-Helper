import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Type } from '../../types';

interface MockupGeneratorState {
  selectedCategory: string;
  selectedBrand: string;
  selectedType: Type | null;
  lightVariantOverlay: File | null;
  darkVariantOverlay: File | null;
  overlayPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  selectedColorVariants: string[];
}

const initialState: MockupGeneratorState = {
  selectedCategory: '',
  selectedBrand: '',
  selectedType: null,
  lightVariantOverlay: null,
  darkVariantOverlay: null,
  overlayPosition: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  selectedColorVariants: [],
};

const mockupGeneratorSlice = createSlice({
  name: 'mockupGenerator',
  initialState,
  reducers: {
    setMockupSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setMockupSelectedBrand(state, action: PayloadAction<string>) {
      state.selectedBrand = action.payload;
    },
    setMockupSelectedType(state, action: PayloadAction<Type | null>) {
      state.selectedType = action.payload;
    },
    setMockupLightVariantOverlay(state, action: PayloadAction<File | null>) {
      state.lightVariantOverlay = action.payload;
    },
    setMockupDarkVariantOverlay(state, action: PayloadAction<File | null>) {
      state.darkVariantOverlay = action.payload;
    },
    setMockupOverlayPosition(state, action: PayloadAction<{ x: number; y: number; width: number; height: number }>) {
      state.overlayPosition = action.payload;
    },
    setMockupSelectedColorVariants(state, action: PayloadAction<string[]>) {
      state.selectedColorVariants = action.payload;
    },
  },
});

export const {
  setMockupSelectedCategory,
  setMockupSelectedBrand,
  setMockupSelectedType,
  setMockupLightVariantOverlay,
  setMockupDarkVariantOverlay,
  setMockupOverlayPosition,
  setMockupSelectedColorVariants,
} = mockupGeneratorSlice.actions;

export default mockupGeneratorSlice.reducer;
