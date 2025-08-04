import { createSlice } from "@reduxjs/toolkit";
import { fetchStudyLevels } from "./actGetStudyLevels";

const studyLevelsSlice = createSlice({
  name: "studyLevels",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudyLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudyLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStudyLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStudyLevelsState } = studyLevelsSlice.actions;
export default studyLevelsSlice.reducer;