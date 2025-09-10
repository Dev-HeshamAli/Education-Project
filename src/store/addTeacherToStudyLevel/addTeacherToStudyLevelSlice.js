// src/store/deleteCourseFromAY/deleteCourseFromAcademicYearSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { addTeacherToStudyLevel } from "./addTeacherToStudyLevel";

const addCourseToAcademicYearSlice = createSlice({
  name: "addTeacherToStudyLevel",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessageAddTeacherToStudyLevel: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTeacherToStudyLevel.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(addTeacherToStudyLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher added to study level successfully";
        state.error = null;
      })
      .addCase(addTeacherToStudyLevel.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload;
      });
  },
});

export const { clearMessageAddTeacherToStudyLevel } = addCourseToAcademicYearSlice.actions;
export default addCourseToAcademicYearSlice.reducer;
