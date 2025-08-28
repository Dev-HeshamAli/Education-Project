import { createSlice } from "@reduxjs/toolkit";
import { fetchJobDiscount } from "./actGetJobDiscount";


const jobDiscountSlice = createSlice({
  name: "jobDiscount",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = jobDiscountSlice.actions;
export default jobDiscountSlice.reducer;