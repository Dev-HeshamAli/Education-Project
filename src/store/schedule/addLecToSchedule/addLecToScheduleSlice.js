// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actAddLecToSchedule } from "./actAddLecToSchedule";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const addLecToScheduleSlice = createSlice({
  name: "addLecToSchedule",
  initialState,
  reducers: {
    clearMessageaddLecToSchedule: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actAddLecToSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actAddLecToSchedule.fulfilled, (state) => {
        state.loading = false;
        state.success = "Lecture added to Schedule successfully";
      })
      .addCase(actAddLecToSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageaddLecToSchedule } = addLecToScheduleSlice.actions; 
export default addLecToScheduleSlice.reducer;
