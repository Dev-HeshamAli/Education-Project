// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateLecToSchedule } from "./actUpdateLecToSchedule";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateLecToScheduleSlice = createSlice({
  name: "updateLecToSchedule",
  initialState,
  reducers: {
    clearMessageUpdateLecToSchedule: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateLecToSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateLecToSchedule.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule updated successfully.";
      })
      .addCase(actUpdateLecToSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageUpdateLecToSchedule } = updateLecToScheduleSlice.actions; 
export default updateLecToScheduleSlice.reducer;
