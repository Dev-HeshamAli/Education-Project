// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteTeacherFromCourse } from "./actDeleteTeacherFromCourse";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteTeacherFromCourseSlice = createSlice({
  name: "deleteTeacherFromCourse",
  initialState,
  reducers: {
    resetDeleteTeacherFromCourseState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteTeacherFromCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteTeacherFromCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher Deleted successfully";
      })
      .addCase(actDeleteTeacherFromCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteTeacherFromCourseState } = deleteTeacherFromCourseSlice.actions;
export default deleteTeacherFromCourseSlice.reducer;
