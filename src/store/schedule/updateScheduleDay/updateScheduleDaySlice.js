// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateScheduleDay } from "./actUpdateScheduleDay";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateScheduleDaySlice = createSlice({
  name: "updateScheduleDay",
  initialState,
  reducers: {
    resetUpdateScheduleDayState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateScheduleDay.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateScheduleDay.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule Day Updated successfully";
      })
      .addCase(actUpdateScheduleDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetUpdateScheduleDayState } = updateScheduleDaySlice.actions;
export default updateScheduleDaySlice.reducer;
