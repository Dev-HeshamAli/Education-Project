// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteScheduleDay } from "./actDeleteScheduleDay";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteScheduleDaySlice = createSlice({
  name: "deleteScheduleDay",
  initialState,
  reducers: {
    resetDeleteScheduleDayState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteScheduleDay.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteScheduleDay.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule Day Deleted successfully";
      })
      .addCase(actDeleteScheduleDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteScheduleDayState } = deleteScheduleDaySlice.actions;
export default deleteScheduleDaySlice.reducer;
