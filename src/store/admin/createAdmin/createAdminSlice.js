// src/redux/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAdmin } from "./actpostAdminData";

const createAdminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: "idle",
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
      resetAdminMessages: (state) => {
    state.successMessage = null;
    state.error = null;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAdmin.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.loading = "succeeded";
        state.successMessage = "Admin created successfully";
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAdminState , resetAdminMessages} = createAdminSlice.actions;
export default createAdminSlice.reducer;
