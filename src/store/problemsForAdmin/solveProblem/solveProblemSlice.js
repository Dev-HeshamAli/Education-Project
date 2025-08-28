// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actSolveProblem } from "./actSolveProblem";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const solveProblemSlice = createSlice({
  name: "solveProblem",
  initialState,
  reducers: {
    clearMessageSolveProblem: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actSolveProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actSolveProblem.fulfilled, (state) => {
        state.loading = false;
        state.success = "Problem solved successfully";
      })
      .addCase(actSolveProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageSolveProblem } = solveProblemSlice.actions; 
export default solveProblemSlice.reducer;
