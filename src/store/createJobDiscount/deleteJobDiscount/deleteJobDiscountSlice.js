// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteJobDiscount } from "./actDeleteJobDiscount";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteJobDiscount = createSlice({
  name: "deleteJobDiscount",
  initialState,
  reducers: {
    clearMessageDeleteJobDiscount: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteJobDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteJobDiscount.fulfilled, (state) => {
        state.loading = false;
        state.success = "Job Discount Deleted successfully";
      })
      .addCase(actDeleteJobDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageDeleteJobDiscount } = deleteJobDiscount.actions; 
export default deleteJobDiscount.reducer;
