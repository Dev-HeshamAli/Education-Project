import { createSlice } from "@reduxjs/toolkit";
import { actGetScheduleTime } from "./actGetScheduleTime";


const scheduleTime = createSlice({
  name: "scheduleTime",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetScheduleTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetScheduleTime.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetScheduleTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default scheduleTime.reducer;