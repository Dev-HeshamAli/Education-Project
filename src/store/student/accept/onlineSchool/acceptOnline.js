// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actAcceptOnline } from "./actAcceptOnline";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const acceptOnline = createSlice({
  name: "acceptOnline",
  initialState,
  reducers: {
    resetAcceptOnlineState : (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAcceptOnline.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actAcceptOnline.fulfilled, (state) => {
        state.loading = false;
        state.success = "Student accepted successfully";
      })
      .addCase(actAcceptOnline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetAcceptOnlineState } = acceptOnline.actions;
export default acceptOnline.reducer;