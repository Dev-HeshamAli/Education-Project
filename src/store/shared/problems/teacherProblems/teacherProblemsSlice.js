import { createSlice } from "@reduxjs/toolkit";
import { actGetTeacherProblems } from "./actGetTeacherProblems";


const teacherProblemsSlice = createSlice({
  name: "teacherProblems",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetTeacherProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetTeacherProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetTeacherProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherProblemsSlice.reducer;