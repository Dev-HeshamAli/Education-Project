// src/store/deleteCourseFromAY/deleteCourseFromAcademicYearSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actAddTeacherToCourse } from "./actAddTeacherToCourse";

const addTeacherToCourseSlice = createSlice({
  name: "addTeacherToCourseSlice",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessageAddTeacherToCourse: (state) => {
      state.success = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAddTeacherToCourse.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(actAddTeacherToCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher added to course successfully.";
        state.error = null;
      })
      .addCase(actAddTeacherToCourse.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload || "Failed to delete course.";
      });
  },
});

export const { clearMessageAddTeacherToCourse } =
  addTeacherToCourseSlice.actions;
export default addTeacherToCourseSlice.reducer;
