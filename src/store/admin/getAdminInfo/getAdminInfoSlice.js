// src/store/admin/updateAdmin/adminDataSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminById } from "./fetchAdminById";

const initialState = {
  loading: false,
  error: null,
  userData: localStorage.getItem("adminInfo") || null,
};

const adminDataSlice = createSlice({
  name: "adminData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default adminDataSlice.reducer;
