// src/redux/slices/mockupGeneratorSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Type } from '../../types';

interface OverlayCoords {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

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
  overlayCoords: OverlayCoords;
}

const initialState: MockupGeneratorState = {
  selectedCategory: '',
  selectedBrand: '',
  selectedType: null,
  lightVariantOverlay: null,
  darkVariantOverlay: null,
  overlayPosition: {
    x: 200,
    y: 200,
    width: 100,
    height: 100,
  },
  selectedColorVariants: [],
  overlayCoords: {
    startX: 200,
    startY: 200,
    endX: 300,
    endY: 300,
  },
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
    setMockupOverlayCoords(state, action: PayloadAction<OverlayCoords>) {
      state.overlayCoords = action.payload;
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
  setMockupOverlayCoords,
} = mockupGeneratorSlice.actions;

export default mockupGeneratorSlice.reducer;
