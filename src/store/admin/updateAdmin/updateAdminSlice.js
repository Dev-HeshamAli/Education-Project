// src/store/admin/updateAdmin/updateAdminSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateAdmin } from "./actUpdateAdmin";

const initialState = {
  loading: false,
  error: null,
  success: false,
  // updatedAdmin: null,
};

const updateAdminSlice = createSlice({
  name: "adminUpdate",
  initialState,
  reducers: {
    resetUpdateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      // state.updatedAdmin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateAdmin.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateAdmin.fulfilled, (state) => {
        state.loading = "succeeded";
        state.success = "Updated successfully";
        // state.updatedAdmin = action.payload;
      })
      .addCase(actUpdateAdmin.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetUpdateState } = updateAdminSlice.actions;
export default updateAdminSlice.reducer;
