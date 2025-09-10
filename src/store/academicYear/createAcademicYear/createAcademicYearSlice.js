// src/store/academicYear/createAcademicYearSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateAcademicYearSlice } from "./actCreateAcademicYearSlice";

const initialState = {
  loading: "idle", // idle | pending | succeeded | failed
  error: null,
  successMessage: null,
};

const createAcademicYearSlice = createSlice({
  name: "academicYear",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateAcademicYearSlice.pending, (state) => {
        state.loading = "pending";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(actCreateAcademicYearSlice.fulfilled, (state) => {
        state.loading = "succeeded";
        state.successMessage = "Academic Year created successfully";
      })
      .addCase(actCreateAcademicYearSlice.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = createAcademicYearSlice.actions;
export default createAcademicYearSlice.reducer;
