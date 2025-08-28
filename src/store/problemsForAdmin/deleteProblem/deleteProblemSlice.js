// store/admin/deleteAdmin/deleteAdminSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { actDeleteProblem } from "./actDeleteProblem";

const deleteProblemSlice = createSlice({
  name: "deleteProblem",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessageDeleteProblem: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteProblem.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(actDeleteProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Problem deleted successfully";
      })
      .addCase(actDeleteProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { clearMessageDeleteProblem } = deleteProblemSlice.actions;
export default deleteProblemSlice.reducer;
