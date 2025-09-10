// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { updateSchoolClass } from "./schoolClassActions";

const updateSchoolClassSlice = createSlice({
  name: "schoolClass",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSchoolClassState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSchoolClass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSchoolClass.fulfilled, (state) => {
        state.loading = false;
        state.success = "Class updated successfully";
        state.error = null;
      })
      .addCase(updateSchoolClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetSchoolClassState } = updateSchoolClassSlice.actions;

export default updateSchoolClassSlice.reducer;
