import { createSlice } from "@reduxjs/toolkit";
import { actGetTeacherSchedule } from "./actGetTeacherSchedule";


const teacherSchedule = createSlice({
  name: "teacherSchedule",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetTeacherSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetTeacherSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetTeacherSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherSchedule.reducer;