import { createSlice } from "@reduxjs/toolkit";
import { actGetScheduleId } from "./actGetScheduleId";


const getScheduleIdSlice = createSlice({
  name: "schedule",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetScheduleId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actGetScheduleId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(actGetScheduleId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getScheduleIdSlice.reducer;