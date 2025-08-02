// store/admin/deleteAdmin/deleteAdminSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { actDeleteAdmin } from "./actDeleteAdmin";

const deleteAdminSlice = createSlice({
  name: "deleteAdmin",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    resetDeleteState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteAdmin.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(actDeleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Admin deleted successfully";
      })
      .addCase(actDeleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { resetDeleteState } = deleteAdminSlice.actions;
export default deleteAdminSlice.reducer;
