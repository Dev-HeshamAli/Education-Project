import { createSlice } from "@reduxjs/toolkit";
import { actGetScheduleInfo } from "./actGetScheduleInfo";


const getScheduleInfoSlice = createSlice({
  name: "scheduleInfo",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetScheduleInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetScheduleInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetScheduleInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getScheduleInfoSlice.reducer;