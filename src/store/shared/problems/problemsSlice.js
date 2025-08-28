import { createSlice } from "@reduxjs/toolkit";
import { fetchProblems } from "./actGetProblems";


const problemsSlice = createSlice({
  name: "problems",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = problemsSlice.actions;
export default problemsSlice.reducer;