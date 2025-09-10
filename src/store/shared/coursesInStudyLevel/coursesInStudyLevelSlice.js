import { createSlice } from "@reduxjs/toolkit";
import { actGetCoursesInStudyLevel } from "./actGetCoursesInStudyLevel";


const coursesInStudyLevelSlice = createSlice({
  name: "coursesInStudyLevel",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetCoursesInStudyLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetCoursesInStudyLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetCoursesInStudyLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
  export const { resetPlansState } = coursesInStudyLevelSlice.actions;
  
export default coursesInStudyLevelSlice.reducer;