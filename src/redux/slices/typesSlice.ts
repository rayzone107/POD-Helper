import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Type } from '../../types';

interface TypesState {
  types: Type[];
}

const initialState: TypesState = {
  types: [],
};

const typesSlice = createSlice({
  name: 'types',
  initialState,
  reducers: {
    setTypes(state, action: PayloadAction<Type[]>) {
      state.types = action.payload;
    },
    addType(state, action: PayloadAction<Type>) {
      state.types.push(action.payload);
    },
    updateType(state, action: PayloadAction<Type>) {
      const index = state.types.findIndex(type => type.id === action.payload.id);
      if (index !== -1) {
        state.types[index] = action.payload;
      }
    },
    deleteType(state, action: PayloadAction<string>) {
      state.types = state.types.filter(type => type.id !== action.payload);
    },
  },
});

export const { setTypes, addType, updateType, deleteType } = typesSlice.actions;
export default typesSlice.reducer;
