// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateTeacher } from "./actUpdateTeacher";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateTeacherSlice = createSlice({
  name: "updateTeacher",
  initialState,
  reducers: {
    resetUpdateTeacherState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateTeacher.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher updated successfully";
      })
      .addCase(actUpdateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetUpdateTeacherState } = updateTeacherSlice.actions;
export default updateTeacherSlice.reducer;
