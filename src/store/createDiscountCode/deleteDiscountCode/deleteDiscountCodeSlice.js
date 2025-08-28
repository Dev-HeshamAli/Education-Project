// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteDiscountCode } from "./actDeleteDiscountCode";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteDiscountCode = createSlice({
  name: "deleteJobDiscount",
  initialState,
  reducers: {
    clearMessageDeleteDiscountCode: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteDiscountCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteDiscountCode.fulfilled, (state) => {
        state.loading = false;
        state.success = "Discount code Deleted successfully";
      })
      .addCase(actDeleteDiscountCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageDeleteDiscountCode } = deleteDiscountCode.actions; 
export default deleteDiscountCode.reducer;
