import { createSlice } from "@reduxjs/toolkit";
import { fetchTeachersByStudyLevel } from "./actGetTeacherByStudyLevel";


const teacherByStudyLevelSlice = createSlice({
  name: "teacherByStudyLevelSlice",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachersByStudyLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachersByStudyLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTeachersByStudyLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlansState } = teacherByStudyLevelSlice.actions;
export default teacherByStudyLevelSlice.reducer;