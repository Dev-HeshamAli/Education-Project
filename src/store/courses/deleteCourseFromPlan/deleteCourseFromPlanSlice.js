// src/store/deleteCourseFromPlan/deleteCourseFromPlanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteCourseFromPlan } from "./actDeleteCourseFromPlan";

const deleteCourseFromPlanSlice = createSlice({
  name: "deleteCourseFromPlan",
  initialState: {
    loading: false,
    successMessage: null,
    errorMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteCourseFromPlan.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(actDeleteCourseFromPlan.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Course deleted from plan successfully";
        state.errorMessage = null;
      })
      .addCase(actDeleteCourseFromPlan.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = deleteCourseFromPlanSlice.actions;
export default deleteCourseFromPlanSlice.reducer;
