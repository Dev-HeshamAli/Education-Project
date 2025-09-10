import { createSlice } from "@reduxjs/toolkit";
import { fetchSolvedProblems } from "./actGetSolvedProblems";


const solvedProblemsSlice = createSlice({
  name: "solvedProblems",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolvedProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolvedProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSolvedProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = solvedProblemsSlice.actions;
export default solvedProblemsSlice.reducer;