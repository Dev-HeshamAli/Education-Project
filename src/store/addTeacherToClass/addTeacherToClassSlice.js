// src/store/deleteCourseFromAY/deleteCourseFromAcademicYearSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actAddTeacherToClass } from "./actAddTeacherToClass";

const addTeacherToCourseSlice = createSlice({
  name: "addTeacherToCourseSlice",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessageAddTeacherToClass: (state) => {
      state.success = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAddTeacherToClass.pending, (state) => {
        state.loading = "Please wait...";
        state.success = null;
        state.error = null;
      })
      .addCase(actAddTeacherToClass.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher added to Class successfully";
        state.error = null;
      })
      .addCase(actAddTeacherToClass.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload;
      });
  },
});

export const { clearMessageAddTeacherToClass } = addTeacherToCourseSlice.actions;
export default addTeacherToCourseSlice.reducer;
