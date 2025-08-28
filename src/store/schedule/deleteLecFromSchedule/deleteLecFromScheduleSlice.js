// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteLecFromSchedule } from "./actDeleteLecFromSchedule";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteLecFromScheduleSlice = createSlice({
  name: "deleteLecFromSchedule",
  initialState,
  reducers: {
    resetDeleteLecFromScheduleState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteLecFromSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteLecFromSchedule.fulfilled, (state) => {
        state.loading = false;
        state.success = "Lecture Deleted successfully";
      })
      .addCase(actDeleteLecFromSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteLecFromScheduleState } = deleteLecFromScheduleSlice.actions;
export default deleteLecFromScheduleSlice.reducer;
