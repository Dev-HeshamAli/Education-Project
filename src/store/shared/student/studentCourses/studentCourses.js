// src/store/admin/updateAdmin/adminDataSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actGetStudentCourses } from "./actGetStudentCourses";

const initialState = {
  loading: false,
  error: null,
  list: [],
};

const studentCoursesSlice = createSlice({
  name: "teacherInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetStudentCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetStudentCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        
      })
      .addCase(actGetStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default studentCoursesSlice.reducer;