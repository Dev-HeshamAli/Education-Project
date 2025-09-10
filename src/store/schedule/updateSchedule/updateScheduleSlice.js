// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actUpdateSchedule } from "./actUpdateSchedule";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const updateScheduleSlice = createSlice({
  name: "updateSchedule",
  initialState,
  reducers: {
    resetUpdateScheduleState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actUpdateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actUpdateSchedule.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule Updated successfully";
      })
      .addCase(actUpdateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetUpdateScheduleState } = updateScheduleSlice.actions;
export default updateScheduleSlice.reducer;
