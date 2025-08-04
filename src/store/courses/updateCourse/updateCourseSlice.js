// src/store/courses/updateCourseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateCourse } from "./actUpdateCourse";

const updateCourseSlice = createSlice({
  name: "updateCourse",
  initialState: {
    loading: false,
    successMessage: null,
    errorMessage: null,
  },
  reducers: {
    clearUpdateMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateCourse.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(actUpdateCourse.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Course updated successfully 🎉";
        state.errorMessage = null;
      })
      .addCase(actUpdateCourse.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearUpdateMessages } = updateCourseSlice.actions;
export default updateCourseSlice.reducer;
