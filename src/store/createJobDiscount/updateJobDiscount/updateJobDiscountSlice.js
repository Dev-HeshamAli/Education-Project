// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateJobDiscount } from "./actUpdateJobDiscount";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateJobDiscount = createSlice({
  name: "updateJobDiscount",
  initialState,
  reducers: {
    clearMessageUpdateJobDiscount: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateJobDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateJobDiscount.fulfilled, (state) => {
        state.loading = false;
        state.success = "Job Discount Updated successfully";
      })
      .addCase(actUpdateJobDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageUpdateJobDiscount } = updateJobDiscount.actions; 
export default updateJobDiscount.reducer;
