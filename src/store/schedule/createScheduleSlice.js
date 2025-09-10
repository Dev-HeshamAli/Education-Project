// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actCreateSchedule } from "./actCreateSchedule";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const createScheduleSlice = createSlice({
  name: "createSchedule",
  initialState,
  reducers: {
    resetCreateScheduleState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actCreateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actCreateSchedule.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule created successfully";
      })
      .addCase(actCreateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetCreateScheduleState } = createScheduleSlice.actions;
export default createScheduleSlice.reducer;
