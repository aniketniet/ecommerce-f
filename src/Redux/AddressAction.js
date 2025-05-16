import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  selectedAddress: null,
};

// Slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
  },
});

// Actions
export const { selectAddress, clearSelectedAddress } = addressSlice.actions;

// Selector
export const setSelectedAddress = (state) => state.address.selectedAddress;

// Reducer
export default addressSlice.reducer;
