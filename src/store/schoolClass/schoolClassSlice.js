// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actSchoolClass } from "./actSchoolClass";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const schoolClassSlice = createSlice({
  name: "schoolClass",
  initialState,
  reducers: {
    resetSchoolClassState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actSchoolClass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actSchoolClass.fulfilled, (state) => {
        state.loading = false;
        state.success = "School class created successfully";
      })
      .addCase(actSchoolClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetSchoolClassState } = schoolClassSlice.actions;
export default schoolClassSlice.reducer;
