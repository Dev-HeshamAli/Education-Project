// src/store/deleteCourseFromAY/deleteCourseFromAcademicYearSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actAddCourseToAcademicYear } from "./actaddCourseToAcademicYear";

const addCourseToAcademicYearSlice = createSlice({
  name: "deleteCourseFromAcademicYear",
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
      .addCase(actAddCourseToAcademicYear.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(actAddCourseToAcademicYear.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Course deleted from academic year successfully";
        state.errorMessage = null;
      })
      .addCase(actAddCourseToAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearMessages } = addCourseToAcademicYearSlice.actions;
export default addCourseToAcademicYearSlice.reducer;
