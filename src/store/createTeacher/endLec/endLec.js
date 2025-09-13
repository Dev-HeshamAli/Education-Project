// src/store/schoolClass/schoolClassSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { actEndLec } from "./actEndLec";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const endLec = createSlice({
  name: "activeLec",
  initialState,
  reducers: {
    resetEndLecState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actEndLec.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actEndLec.fulfilled, (state) => {
        state.loading = false;
        state.success = "Lecturer End successfully";
      })
      .addCase(actEndLec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetEndLecState } = endLec.actions; // ⚠️ صحح الاسم هنا
export default endLec.reducer;
