// store/admin/deleteAdmin/deleteAdminSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { actDeleteTeacherProblem } from "./actDeleteProblem";

const deleteTeacherProblemSlice = createSlice({
  name: "deleteTeacherProblem",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessageDeleteTeacherProblem: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteTeacherProblem.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(actDeleteTeacherProblem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Problem deleted successfully";
      })
      .addCase(actDeleteTeacherProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { clearMessageDeleteTeacherProblem } = deleteTeacherProblemSlice.actions;
export default deleteTeacherProblemSlice.reducer;
