import { createSlice } from "@reduxjs/toolkit";
import { fetchCoursesStudyLevels } from "./actGetCoursesStudyLevel";


const coursesStudyLevelSlice = createSlice({
  name: "coursesStudyLevels",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesStudyLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesStudyLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCoursesStudyLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = coursesStudyLevelSlice.actions;
export default coursesStudyLevelSlice.reducer;