// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actActiveTeacher } from "./actActiveTeacher";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const activeTeacherSlice = createSlice({
  name: "activeTeacher",
  initialState,
  reducers: {
    resetActiveTeacherStates: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actActiveTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actActiveTeacher.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher activated successfully";
      })
      .addCase(actActiveTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetActiveTeacherStates } = activeTeacherSlice.actions;
export default activeTeacherSlice.reducer;
