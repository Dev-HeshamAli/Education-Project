// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateDiscountCode } from "./actcreateDiscountCode";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createDiscountCode = createSlice({
  name: "discountCode",
  initialState,
  reducers: {
    clearMessageCreateCode: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateDiscountCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreateDiscountCode.fulfilled, (state) => {
        state.loading = false;
        state.success = "Discount code created successfully";
      })
      .addCase(actCreateDiscountCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageCreateCode } = createDiscountCode.actions; // ⚠️ صحح الاسم هنا
export default createDiscountCode.reducer;
