// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteStudyLevel } from "./actDeleteStudyLevel";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteStudyLevelSlice = createSlice({
  name: "deleteStudyLevel",
  initialState,
  reducers: {
    clearMessageDeleteStudyLevel: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteStudyLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteStudyLevel.fulfilled, (state) => {
        state.loading = false;
        state.success = "Study level deleted successfully";
      })
      .addCase(actDeleteStudyLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageDeleteStudyLevel } = deleteStudyLevelSlice.actions; 
export default deleteStudyLevelSlice.reducer;
