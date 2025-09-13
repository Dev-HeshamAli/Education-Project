// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actActiveLec } from "./actActiveLec";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const activeLec = createSlice({
  name: "activeLec",
  initialState,
  reducers: {
    resetActiveLecState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actActiveLec.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actActiveLec.fulfilled, (state) => {
        state.loading = false;
        state.success = "Lecturer activated successfully";
      })
      .addCase(actActiveLec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetActiveLecState } = activeLec.actions; // ⚠️ صحح الاسم هنا
export default activeLec.reducer;
