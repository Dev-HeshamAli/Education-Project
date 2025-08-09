// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteTeacher } from "./actDeleteTeacher";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteTeacherSlice = createSlice({
  name: "deleteTeacher",
  initialState,
  reducers: {
    resetDeleteTeacherState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteTeacher.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher Deleted successfully";
      })
      .addCase(actDeleteTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteTeacherState } = deleteTeacherSlice.actions;
export default deleteTeacherSlice.reducer;
