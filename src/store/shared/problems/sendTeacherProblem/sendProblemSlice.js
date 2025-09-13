// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actsendProblem } from "./actsendProblem";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const sendProblemSlice = createSlice({
  name: "sendProblem",
  initialState,
  reducers: {
    clearMessageSendProblem: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actsendProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actsendProblem.fulfilled, (state) => {
        state.loading = false;
        state.success = "Problem solved successfully";
      })
      .addCase(actsendProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearMessageSendProblem } = sendProblemSlice.actions; 
export default sendProblemSlice.reducer;
