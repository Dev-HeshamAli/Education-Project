// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actReject } from "./actReject";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const rejectSlice = createSlice({
  name: "reject",
  initialState,
  reducers: {
    resetRejectState : (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actReject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actReject.fulfilled, (state) => {
        state.loading = false;
        state.success = "Student rejected successfully";
      })
      .addCase(actReject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetRejectState } = rejectSlice.actions;
export default rejectSlice.reducer;