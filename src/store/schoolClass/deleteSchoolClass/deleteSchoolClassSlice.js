// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteSchoolClass } from "./actDeleteSchoolClass";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteSchoolClassSlice = createSlice({
  name: "deleteSchoolClass",
  initialState,
  reducers: {
    resetDeleteSchoolClassState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteSchoolClass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteSchoolClass.fulfilled, (state) => {
        state.loading = false;
        state.success = "School class Deleted successfully";
      })
      .addCase(actDeleteSchoolClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteSchoolClassState } = deleteSchoolClassSlice.actions;
export default deleteSchoolClassSlice.reducer;
