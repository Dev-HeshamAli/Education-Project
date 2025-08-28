// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actDeleteSchedule } from "./actDeleteSchedule";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteScheduleSlice = createSlice({
  name: "deleteSchedule",
  initialState,
  reducers: {
    resetDeleteScheduleState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actDeleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actDeleteSchedule.fulfilled, (state) => {
        state.loading = false;
        state.success = "Schedule Deleted successfully";
      })
      .addCase(actDeleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteScheduleState } = deleteScheduleSlice.actions;
export default deleteScheduleSlice.reducer;
