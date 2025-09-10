// src/store/course/courseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateCourse } from "./actCreateCourse";

const courseSlice = createSlice({
  name: "course",
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
      .addCase(actCreateCourse.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(actCreateCourse.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Course created successfully";
        state.errorMessage = null;
      })
      .addCase(actCreateCourse.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.errorMessage = action.payload 
      });
  },
});

export const { clearMessages } = courseSlice.actions;
export default courseSlice.reducer;
