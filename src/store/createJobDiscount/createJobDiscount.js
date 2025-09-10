// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateJobDiscount } from "./actCreateJobDiscount";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createJobDiscount = createSlice({
  name: "jobDiscount",
  initialState,
  reducers: {
    clearMessageCreateJobDiscount: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateJobDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreateJobDiscount.fulfilled, (state) => {
        state.loading = false;
        state.success = "Job Discount created successfully";
      })
      .addCase(actCreateJobDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageCreateJobDiscount } = createJobDiscount.actions; 
export default createJobDiscount.reducer;
