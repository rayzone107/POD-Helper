import { configureStore, ThunkAction, Action, ThunkDispatch } from '@reduxjs/toolkit';
import itemsReducer from './slices/itemsSlice';
import categoriesReducer from './slices/categoriesSlice';
import brandsReducer from './slices/brandsSlice';
import typesReducer from './slices/typesSlice';
import pricingCalculatorReducer from './slices/pricingCalculatorSlice';
import mockupGeneratorReducer from './slices/mockupGeneratorSlice';

const store = configureStore({
  reducer: {
    items: itemsReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    types: typesReducer,
    pricingCalculator: pricingCalculatorReducer,
    mockupGenerator: mockupGeneratorReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, Action<string>>;

export default store;
