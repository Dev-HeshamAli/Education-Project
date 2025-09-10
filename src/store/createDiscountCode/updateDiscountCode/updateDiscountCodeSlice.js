// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateDiscountCode } from "./actUpdateDiscountCode";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateDiscountCode = createSlice({
  name: "updateDiscountCode",
  initialState,
  reducers: {
    clearMessageUpdateDiscountCode: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateDiscountCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateDiscountCode.fulfilled, (state) => {
        state.loading = false;
        state.success = "Discount code Updated successfully";
      })
      .addCase(actUpdateDiscountCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageUpdateDiscountCode } = updateDiscountCode.actions; 
export default updateDiscountCode.reducer;
