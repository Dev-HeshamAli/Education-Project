// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateTeacher } from "./actCreateTeacher";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createTeacherSlice = createSlice({
  name: "createTeacher",
  initialState,
  reducers: {
    resetCreateTeacherState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreateTeacher.fulfilled, (state) => {
        state.loading = false;
        state.success = "Teacher created successfully";
      })
      .addCase(actCreateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetCreateTeacherState } = createTeacherSlice.actions; // ⚠️ صحح الاسم هنا
export default createTeacherSlice.reducer;
