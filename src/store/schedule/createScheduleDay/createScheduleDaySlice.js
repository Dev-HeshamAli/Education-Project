// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateScheduleDay } from "./actCreateScheduleDay";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createScheduleDaySlice = createSlice({
  name: "createSchedule",
  initialState,
  reducers: {
    resetCreateScheduleDayState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateScheduleDay.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreateScheduleDay.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule Day created successfully";
      })
      .addCase(actCreateScheduleDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetCreateScheduleDayState } = createScheduleDaySlice.actions;
export default createScheduleDaySlice.reducer;
