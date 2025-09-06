// src/store/deleteCourseFromAY/deleteCourseFromAcademicYearSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actLogout } from "./actLogout";

const logoutSlice = createSlice({
  name: "logoutSlice",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessageLogout: (state) => {
      state.success = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actLogout.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(actLogout.fulfilled, (state) => {
        state.loading = false;
        state.success = "Logout successfully.";
        state.error = null;
      })
      .addCase(actLogout.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload || "Failed to logout";
      });
  },
});

export const { clearMessageLogout } = logoutSlice.actions;
export default logoutSlice.reducer;
