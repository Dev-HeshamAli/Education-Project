// src/store/shared/deleteCourse/deleteCourseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteCourse } from "./actDeleteCourse";

const deleteCourseSlice = createSlice({
  name: "deleteCourse",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    resetDeleteStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteCourse.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(actDeleteCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = "Course deleted successfully.";
        state.error = null;
      })
      .addCase(actDeleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload || "Failed to delete course.";
      });
  },
});

export const { resetDeleteStatus } = deleteCourseSlice.actions;
export default deleteCourseSlice.reducer;
