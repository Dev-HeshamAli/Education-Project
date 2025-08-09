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
        state.loading = "Please wait...";
        state.success = null;
        state.error = null;
      })
      .addCase(actAddTeacherToCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher added to Course successfully";
        state.error = null;
      })
      .addCase(actAddTeacherToCourse.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload;
      });
  },
});

export const { clearMessageAddTeacherToCourse } = addTeacherToCourseSlice.actions;
export default addTeacherToCourseSlice.reducer;
