import { createSlice } from '@reduxjs/toolkit';

const productionSlice = createSlice({
  name: 'production',
  initialState: {
    products: [],
    totalValue: 0,
    loading: false,
    error: null,
  },
  reducers: {},
});

export default productionSlice.reducer;
