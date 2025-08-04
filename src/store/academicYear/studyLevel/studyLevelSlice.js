// src/store/studyLevel/studyLevelSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actStudyLevel } from "./actStudyLevel";

const studyLevelSlice = createSlice({
  name: "studyLevel",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetStudyLevelState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actStudyLevel.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(actStudyLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actStudyLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStudyLevelState } = studyLevelSlice.actions;
export default studyLevelSlice.reducer;
