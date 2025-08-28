import { createSlice } from "@reduxjs/toolkit";
import { fetchDiscountCode } from "./actGetDiscountCode";


const discountCodeSlice = createSlice({
  name: "discountCode",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountCode.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDiscountCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = discountCodeSlice.actions;
export default discountCodeSlice.reducer;