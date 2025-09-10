import { createSlice } from "@reduxjs/toolkit";
import { fetchSemesters } from "./actGetSemesters";


const semestersSlice = createSlice({
  name: "semesters",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSemesters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSemesters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = semestersSlice.actions;
export default semestersSlice.reducer;