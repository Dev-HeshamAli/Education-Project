// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actOnlineOrOffline } from "./actOnlineOrOffline";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const acceptOnlineOrOffline = createSlice({
  name: "acceptOnlineOrOffline",
  initialState,
  reducers: {
    resetAcceptOnlineOrOfflineState : (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actOnlineOrOffline.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actOnlineOrOffline.fulfilled, (state) => {
        state.loading = false;
        state.success = "Student accepted successfully";
      })
      .addCase(actOnlineOrOffline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetAcceptOnlineOrOfflineState } = acceptOnlineOrOffline.actions;
export default acceptOnlineOrOffline.reducer;